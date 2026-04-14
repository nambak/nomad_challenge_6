'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'

const logInSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .email('Invalid email address'),
  password: z
    .string({ error: 'Password is required' })
    .min(1, 'Password is required'),
})

export type LogInState = {
  success: boolean
  errors?: {
    email?: string[]
    password?: string[]
    form?: string[]
  }
}

export async function logIn(
  _prevState: LogInState,
  formData: FormData
): Promise<LogInState> {
  const parsed = logInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return {
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
    }
  }

  const { email, password } = parsed.data

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  })

  // Use the same generic error for both cases so attackers can't enumerate users.
  const invalidCredentials: LogInState = {
    success: false,
    errors: { form: ['Invalid email or password'] },
  }

  if (!user) return invalidCredentials

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return invalidCredentials

  const session = await getSession()
  session.userId = user.id
  await session.save()

  redirect('/profile')
}
