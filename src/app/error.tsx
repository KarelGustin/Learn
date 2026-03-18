"use client"

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
      <h2 className="text-xl font-semibold text-zinc-50 mb-2">Something went wrong</h2>
      <p className="text-sm text-zinc-400 mb-6 max-w-md text-center">
        {error.message || 'An unexpected error occurred. This might happen if the database is not seeded yet.'}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline" size="sm">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/dashboard'} size="sm">
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}
