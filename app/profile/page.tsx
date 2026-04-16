import Link from 'next/link'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { logOut } from './actions'

export default async function ProfilePage() {
  const session = await getSession()

  // Middleware already guards this route, but this is defense-in-depth.
  if (!session.userId) {
    redirect('/log-in')
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      created_at: true,
    },
  })

  if (!user) {
    // Session points at a user that no longer exists — clear it.
    session.destroy()
    redirect('/log-in')
  }

  const joined = user.created_at.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-1 flex-col bg-white font-sans">
      <header className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold text-stone-600 transition-colors hover:text-stone-900"
        >
          ← Tweets
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center gap-8 px-6 py-10">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-100 text-3xl font-bold text-rose-400">
            {user.username.charAt(0).toUpperCase()}
          </div>

          <div className="w-full text-center">
            <h1 className="text-2xl font-bold text-stone-800">
              {user.username}
            </h1>
            <p className="mt-1 text-sm text-stone-500">{user.email}</p>
          </div>

          <div className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-700">
            <div className="flex items-center justify-between py-1">
              <span className="font-semibold text-stone-500">Bio</span>
              <span>{user.bio ?? '—'}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-stone-200 py-2">
              <span className="font-semibold text-stone-500">Joined</span>
              <span>{joined}</span>
            </div>
          </div>

          <form action={logOut} className="w-full">
            <button
              type="submit"
              className="w-full rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-all hover:bg-stone-100"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
