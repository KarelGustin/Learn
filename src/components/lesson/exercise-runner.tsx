"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"

interface Exercise {
  id: string
  type: string
  question: string
  options: string | null
  correctAnswer: string
  explanation: string
  difficulty: string
}

export function ExerciseRunner({ exercise, index }: { exercise: Exercise; index: number }) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [textAnswer, setTextAnswer] = useState("")

  const options = exercise.options ? JSON.parse(exercise.options) as string[] : []
  const correctAnswer = JSON.parse(exercise.correctAnswer) as string

  const isCorrect = submitted && (
    exercise.type === 'SHORT_ANSWER' || exercise.type === 'CODE_CHALLENGE'
      ? textAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()
      : selectedAnswer === correctAnswer
  )

  const handleSubmit = async () => {
    setSubmitted(true)
    setShowExplanation(true)

    // Record attempt via API
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise.id,
          answer: exercise.type === 'SHORT_ANSWER' || exercise.type === 'CODE_CHALLENGE' ? textAnswer : selectedAnswer,
          correct: exercise.type === 'SHORT_ANSWER' || exercise.type === 'CODE_CHALLENGE'
            ? textAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()
            : selectedAnswer === correctAnswer,
          timeSpentMs: 0,
          hints: 0,
          confidence: 3,
        }),
      })
    } catch {
      // Silently fail — attempt recording is non-blocking
    }
  }

  return (
    <Card className={cn(
      "transition-colors",
      submitted && isCorrect && "border-emerald-600/30",
      submitted && !isCorrect && "border-red-600/30"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Exercise {index + 1}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">{exercise.type.replace('_', ' ')}</Badge>
            {submitted && (
              isCorrect
                ? <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" /> Correct</Badge>
                : <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Incorrect</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-zinc-200 font-medium">{exercise.question}</p>

        {/* Multiple Choice */}
        {(exercise.type === 'MULTIPLE_CHOICE' || exercise.type === 'TRUE_FALSE') && options.length > 0 && (
          <div className="space-y-2">
            {options.map((option, i) => (
              <button
                key={i}
                onClick={() => !submitted && setSelectedAnswer(option)}
                disabled={submitted}
                className={cn(
                  "w-full text-left rounded-lg border p-3 text-sm transition-colors",
                  !submitted && selectedAnswer === option && "border-emerald-600 bg-emerald-600/10 text-zinc-50",
                  !submitted && selectedAnswer !== option && "border-zinc-800 text-zinc-300 hover:border-zinc-700",
                  submitted && option === correctAnswer && "border-emerald-600 bg-emerald-600/10 text-emerald-400",
                  submitted && option !== correctAnswer && selectedAnswer === option && "border-red-600 bg-red-600/10 text-red-400",
                  submitted && option !== correctAnswer && selectedAnswer !== option && "border-zinc-800 text-zinc-500",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Short Answer / Code */}
        {(exercise.type === 'SHORT_ANSWER' || exercise.type === 'CODE_CHALLENGE') && (
          <div>
            <textarea
              value={textAnswer}
              onChange={e => setTextAnswer(e.target.value)}
              disabled={submitted}
              placeholder={exercise.type === 'CODE_CHALLENGE' ? 'Write your code here...' : 'Type your answer...'}
              className={cn(
                "w-full rounded-lg border bg-zinc-900 p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-600",
                exercise.type === 'CODE_CHALLENGE' ? "font-mono h-32" : "h-20",
                "border-zinc-800"
              )}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          {!submitted && (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer && !textAnswer.trim()}
              size="sm"
            >
              Check Answer
            </Button>
          )}
          {submitted && (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              {showExplanation ? 'Hide' : 'Show'} explanation
              {showExplanation ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>

        {showExplanation && submitted && (
          <div className="rounded-lg bg-zinc-800/50 border border-zinc-700 p-4 text-sm text-zinc-300">
            {exercise.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
