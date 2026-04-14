'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export async function logOut() {
  const session = await getSession()
  session.destroy()
  redirect('/log-in')
}
