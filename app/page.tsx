import { redirect } from 'next/navigation'

// Middleware handles the authenticated case by redirecting "/" to "/profile".
// This fallback covers the unauthenticated case.
export default function RootPage() {
  redirect('/log-in')
}
