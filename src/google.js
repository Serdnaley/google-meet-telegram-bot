import { google } from 'googleapis'
import { DateTime } from 'luxon'
import { authorize } from './auth.js'

const getAuthorizedCalendar = async () => {
  const auth = await authorize()

  return google.calendar({ version: 'v3', auth })
}

export const createMeet = async () => {
  const calendar = await getAuthorizedCalendar()

  const event = {
    summary: 'Google Meet',
    location: 'Virtual / Google Meet',
    start: {
      dateTime: DateTime.now().toISO(),
      timeZone: 'Europe/Kiev',
    },
    end: {
      dateTime: DateTime.now().plus({ hours: 1 }).toISO(),
      timeZone: 'Europe/Kiev',
    },
    conferenceData: {
      createRequest: {
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
        requestId: 'telegram-bot-meet',
      },
    },
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
  })

  const { config: { data: { summary, start, end } }, data: { conferenceData } } = response

  const { uri } = conferenceData.entryPoints[0]

  return {
    uri,
    summary,
    start,
    end,
  }
}

export const listEvents = async () => {
  const calendar = await getAuthorizedCalendar()

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  })

  return res.data.items
}
