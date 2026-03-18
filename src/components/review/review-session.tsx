"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, Eye } from "lucide-react"

interface ReviewItem {
  id: string
  question: string
  answer: string
  interval: number
  repetition: number
  efactor: number
}

const gradeLabels = [
  { grade: 0, label: "Blackout", color: "bg-red-600" },
  { grade: 1, label: "Wrong", color: "bg-red-500" },
  { grade: 2, label: "Hard Wrong", color: "bg-orange-500" },
  { grade: 3, label: "Hard Right", color: "bg-yellow-500" },
  { grade: 4, label: "Good", color: "bg-emerald-500" },
  { grade: 5, label: "Perfect", color: "bg-emerald-400" },
] as const

export function ReviewSession({ reviews }: { reviews: ReviewItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState(0)
  const [sessionDone, setSessionDone] = useState(false)

  const current = reviews[currentIndex]

  const handleGrade = async (grade: number) => {
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewItemId: current.id, grade }),
      })
    } catch {
      // Non-blocking
    }

    setCompleted(c => c + 1)
    setShowAnswer(false)

    if (currentIndex + 1 < reviews.length) {
      setCurrentIndex(i => i + 1)
    } else {
      setSessionDone(true)
    }
  }

  if (sessionDone) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-50 mb-2">Session Complete!</h3>
          <p className="text-zinc-400">Reviewed {completed} items. Great work maintaining your knowledge.</p>
        </CardContent>
      </Card>
    )
  }

  if (!current) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">{currentIndex + 1} / {reviews.length}</Badge>
        <span className="text-xs text-zinc-500">{completed} completed</span>
      </div>

      <Card>
        <CardContent className="p-8">
          {/* Question */}
          <div className="text-center mb-8">
            <p className="text-lg text-zinc-200 font-medium">{current.question}</p>
          </div>

          {/* Answer */}
          <div className="text-center mb-8">
            {showAnswer ? (
              <div className="rounded-lg bg-zinc-800 border border-zinc-700 p-6">
                <p className="text-zinc-100">{current.answer}</p>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowAnswer(true)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" /> Show Answer
              </Button>
            )}
          </div>

          {/* Grade Buttons */}
          {showAnswer && (
            <div>
              <p className="text-xs text-zinc-500 text-center mb-3">How well did you remember?</p>
              <div className="grid grid-cols-6 gap-2">
                {gradeLabels.map(({ grade, label, color }) => (
                  <button
                    key={grade}
                    onClick={() => handleGrade(grade)}
                    className={cn(
                      "rounded-lg p-2 text-xs font-medium text-white transition-opacity hover:opacity-90",
                      color
                    )}
                  >
                    <div className="text-lg font-bold">{grade}</div>
                    <div className="text-[10px] opacity-80">{label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
