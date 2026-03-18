"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { CheckCircle, Circle } from "lucide-react"

interface Milestone {
  id: string
  name: string
  description: string
  completed: boolean
  sortOrder: number
}

export function MilestoneToggle({ milestone, index }: { milestone: Milestone; index: number }) {
  const [completed, setCompleted] = useState(milestone.completed)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggle = async () => {
    setLoading(true)
    try {
      await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: milestone.id, completed: !completed }),
      })
      setCompleted(!completed)
      router.refresh()
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "w-full flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
        completed ? "border-emerald-600/30 bg-emerald-600/5" : "border-zinc-800 hover:border-zinc-700"
      )}
    >
      {completed
        ? <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        : <Circle className="h-5 w-5 text-zinc-600 flex-shrink-0 mt-0.5" />
      }
      <div>
        <h4 className={cn("text-sm font-medium", completed ? "text-zinc-500 line-through" : "text-zinc-200")}>
          {index + 1}. {milestone.name}
        </h4>
        <p className="text-xs text-zinc-500 mt-0.5">{milestone.description}</p>
      </div>
    </button>
  )
}
