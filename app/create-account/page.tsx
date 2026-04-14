'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { SubmitButton } from '@/app/components/SubmitButton'
import { createAccount, type CreateAccountState } from './actions'

const initialState: CreateAccountState = { success: false }

export default function CreateAccountPage() {
  const [state, formAction] = useActionState(createAccount, initialState)

  const usernameError = state.errors?.username?.[0]
  const emailError = state.errors?.email?.[0]
  const passwordError = state.errors?.password?.[0]
  const confirmPasswordError = state.errors?.confirm_password?.[0]

  return (
    <div className="flex flex-1 items-center justify-center bg-white font-sans">
      <div className="flex w-full max-w-md flex-col items-center gap-8 px-6">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          className="text-rose-400"
        >
          <path
            d="M12 23C6.5 23 2 18.5 2 13c0-3.5 2-6.5 4-8.5 0 0 .5 3.5 3 5C9.5 7 11 2 11 2c1 2.5 3 5.5 3 5.5s2-1.5 2-4c2 2.5 4 5.5 4 9.5 0 5.5-4.5 10-8 10z"
            fill="currentColor"
          />
        </svg>

        <div className="w-full text-center">
          <h1 className="text-2xl font-bold text-stone-800">Create account</h1>
          <p className="mt-1 text-sm text-stone-500">
            Sign up to get started
          </p>
        </div>

        <form action={formAction} className="flex w-full flex-col gap-4">
          <Field
            name="username"
            type="text"
            placeholder="Username"
            error={usernameError}
            autoComplete="username"
          />
          <Field
            name="email"
            type="email"
            placeholder="Email"
            error={emailError}
            autoComplete="email"
          />
          <Field
            name="password"
            type="password"
            placeholder="Password"
            error={passwordError}
            autoComplete="new-password"
          />
          <Field
            name="confirm_password"
            type="password"
            placeholder="Confirm password"
            error={confirmPasswordError}
            autoComplete="new-password"
          />

          <SubmitButton label="Create account" pendingLabel="Creating..." />
        </form>

        <p className="text-sm text-stone-500">
          Already have an account?{' '}
          <Link href="/log-in" className="font-semibold text-rose-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({
  name,
  type,
  placeholder,
  error,
  autoComplete,
}: {
  name: string
  type: string
  placeholder: string
  error?: string
  autoComplete?: string
}) {
  return (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full rounded-full py-3 pl-5 pr-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 ${
          error
            ? 'border-2 border-rose-400 bg-white'
            : 'border border-stone-200 bg-stone-100/60 focus:border-stone-300 focus:bg-white'
        }`}
      />
      {error && (
        <p className="mt-1.5 pl-4 text-xs font-medium text-rose-400">{error}</p>
      )}
    </div>
  )
}
