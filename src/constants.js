import path from 'path'

export const GOOGLE_MEET_LOGO_URL = 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_1x_web_96dp.png'

export const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
]
export const TOKEN_PATH = path.join(process.cwd(), 'token.json')
export const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')
