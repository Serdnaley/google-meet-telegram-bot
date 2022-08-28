import 'dotenv-flow/config.js'
import { Telegraf } from 'telegraf'
import { GOOGLE_MEET_LOGO_URL } from './constants.js'
import { createMeet } from './google.js'

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))

bot.on('inline_query', async (ctx) => {
  return ctx.answerInlineQuery([{
    type: 'article',
    id: 'new-meet',
    title: 'Create a new meet',
    thumb_url: GOOGLE_MEET_LOGO_URL,
    input_message_content: {
      message_text: 'Creating a meet...',
    },
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Loading...',
          callback_data: 'loading',
        }],
      ],
    },
  }])
})

bot.on('chosen_inline_result', async (ctx) => {
  const {
    from: {
      id: userId,
    },
    result_id: key,
    inline_message_id: messageId,
  } = ctx.chosenInlineResult

  if (userId !== +process.env.TG_USER_ID) {
    await ctx.telegram.editMessageText(null, null, messageId, 'Unauthorized')
    await ctx.telegram.editMessageReplyMarkup(null, null, messageId, {
      inline_keyboard: [
        [{
          text: 'Contact author',
          url: 'https://t.me/serdnaley',
        }],
      ],
    })

    return
  }

  if (key === 'new-meet') {
    const { uri } = await createMeet()

    await ctx.telegram.editMessageText(null, null, messageId, `Google Meet created \n\n${uri}`)
    await ctx.telegram.editMessageReplyMarkup(null, null, messageId, {
      inline_keyboard: [
        [{
          text: 'Open a meet',
          url: uri,
        }],
      ],
    })

    return
  }

  return false
})

bot.command('new', async (ctx) => {
  if (ctx.from.id !== process.env.TG_USER_ID) {
    return await ctx.reply('Unauthorized')
  }

  const { uri } = await createMeet()

  ctx.reply(`Meeting created:\n${ uri }`)
})

bot.launch().then(() => {
  console.log('Bot successfully started')
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
