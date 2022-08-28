import { authenticate } from '@google-cloud/local-auth'
import { promises as fs } from 'fs'
import { google } from 'googleapis'
import { CREDENTIALS_PATH, SCOPES, TOKEN_PATH } from './constants.js'

const loadSavedCredentialsIfExist = async () => {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content.toString())

    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

const saveCredentials = async (client) => {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })

  await fs.writeFile(TOKEN_PATH, payload)
}

export const authorize = async () => {
  let client = await loadSavedCredentialsIfExist()

  if (client) return client

  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })

  if (client.credentials) await saveCredentials(client)

  return client
}

