"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

export function LessonCompleter({ lessonId, exerciseCount }: { lessonId: string; exerciseCount: number }) {
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setLoading(true)
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          completed: true,
          score: 1.0,
          timeSpentMs: 0,
        }),
      })
      setCompleted(true)
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  if (completed) {
    return (
      <Card className="border-emerald-600/30">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-50 mb-2">Lesson Complete!</h3>
          <p className="text-zinc-400 mb-6">Great work. Your progress has been saved.</p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-zinc-200">Ready to continue?</h3>
          <p className="text-xs text-zinc-500 mt-1">
            {exerciseCount > 0 ? 'Complete the exercises above, then mark this lesson done.' : 'Mark this lesson as complete when you\'re ready.'}
          </p>
        </div>
        <Button onClick={handleComplete} disabled={loading} variant="success">
          {loading ? 'Saving...' : 'Complete Lesson'}
        </Button>
      </CardContent>
    </Card>
  )
}
