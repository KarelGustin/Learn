import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <p className="text-6xl font-bold text-zinc-700">404</p>
      <p className="text-zinc-400 mt-2 mb-6">Page not found</p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
    </div>
  )
}
