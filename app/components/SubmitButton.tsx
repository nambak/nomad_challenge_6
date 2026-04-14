'use client'

import { useFormStatus } from 'react-dom'

type Props = {
  label?: string
  pendingLabel?: string
}

export function SubmitButton({ label = 'Log in', pendingLabel = 'Loading...' }: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-stone-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
