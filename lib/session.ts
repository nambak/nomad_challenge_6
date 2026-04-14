import { cookies } from 'next/headers'
import { getIronSession, type SessionOptions } from 'iron-session'

export type SessionData = {
  userId?: number
}

const sessionOptions: SessionOptions = {
  cookieName: 'nomad_auth_session',
  password: process.env.SESSION_PASSWORD!,
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}
