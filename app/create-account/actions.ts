'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'

const createAccountSchema = z
  .object({
    username: z
      .string({ error: 'Username is required' })
      .trim()
      .min(3, 'Username must be at least 3 characters long')
      .max(20, 'Username must be at most 20 characters long'),
    email: z
      .string({ error: 'Email is required' })
      .trim()
      .email('Invalid email address'),
    password: z
      .string({ error: 'Password is required' })
      .min(10, 'Password must be at least 10 characters long')
      .regex(/\d/, 'Password must contain at least one number'),
    confirm_password: z
      .string({ error: 'Please confirm your password' })
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export type CreateAccountState = {
  success: boolean
  errors?: {
    username?: string[]
    email?: string[]
    password?: string[]
    confirm_password?: string[]
    form?: string[]
  }
}

export async function createAccount(
  _prevState: CreateAccountState,
  formData: FormData
): Promise<CreateAccountState> {
  const parsed = createAccountSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  })

  if (!parsed.success) {
    return {
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
    }
  }

  const { username, email, password } = parsed.data

  // Check uniqueness at DB level (not just schema level) for nicer errors.
  const [usernameTaken, emailTaken] = await Promise.all([
    db.user.findUnique({ where: { username }, select: { id: true } }),
    db.user.findUnique({ where: { email }, select: { id: true } }),
  ])

  const fieldErrors: CreateAccountState['errors'] = {}
  if (usernameTaken) fieldErrors.username = ['This username is already taken']
  if (emailTaken) fieldErrors.email = ['This email is already registered']
  if (fieldErrors.username || fieldErrors.email) {
    return { success: false, errors: fieldErrors }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await db.user.create({
    data: { username, email, password: hashedPassword },
    select: { id: true },
  })

  const session = await getSession()
  session.userId = user.id
  await session.save()

  redirect('/')
}
