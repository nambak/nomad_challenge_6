'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-stone-200 px-6 py-3 text-sm font-semibold text-stone-700 transition-all hover:bg-stone-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Loading...' : 'Log in'}
    </button>
  )
}
