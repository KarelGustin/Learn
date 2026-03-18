"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Send } from "lucide-react"

const moods = [
  { value: 1, label: "Rough", color: "bg-red-600" },
  { value: 2, label: "Hard", color: "bg-orange-500" },
  { value: 3, label: "Okay", color: "bg-yellow-500" },
  { value: 4, label: "Good", color: "bg-emerald-500" },
  { value: 5, label: "Great", color: "bg-emerald-400" },
]

export function JournalEditor() {
  const [content, setContent] = useState("")
  const [mood, setMood] = useState<number | null>(null)
  const [whatWentWell, setWhatWentWell] = useState("")
  const [whatWasHard, setWhatWasHard] = useState("")
  const [whatILearned, setWhatILearned] = useState("")
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      await fetch('/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          mood,
          whatWentWell: whatWentWell || undefined,
          whatWasHard: whatWasHard || undefined,
          whatILearned: whatILearned || undefined,
        }),
      })
      setContent("")
      setMood(null)
      setWhatWentWell("")
      setWhatWasHard("")
      setWhatILearned("")
      router.refresh()
    } catch {
      // handle error
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">New Reflection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mood selector */}
        <div>
          <p className="text-xs text-zinc-500 mb-2">How did today feel?</p>
          <div className="flex gap-2">
            {moods.map(m => (
              <button
                key={m.value}
                onClick={() => setMood(mood === m.value ? null : m.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  mood === m.value
                    ? `${m.color} text-white`
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind? What did you learn, struggle with, or discover today?"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 h-24 resize-none"
        />

        {/* Structured prompts */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500">What went well</label>
            <textarea
              value={whatWentWell}
              onChange={e => setWhatWentWell(e.target.value)}
              className="w-full rounded border border-zinc-800 bg-zinc-900 p-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 h-16 resize-none mt-1"
              placeholder="Wins and progress..."
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500">What was hard</label>
            <textarea
              value={whatWasHard}
              onChange={e => setWhatWasHard(e.target.value)}
              className="w-full rounded border border-zinc-800 bg-zinc-900 p-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 h-16 resize-none mt-1"
              placeholder="Challenges and blockers..."
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500">Key insight</label>
            <textarea
              value={whatILearned}
              onChange={e => setWhatILearned(e.target.value)}
              className="w-full rounded border border-zinc-800 bg-zinc-900 p-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 h-16 resize-none mt-1"
              placeholder="Main takeaway..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!content.trim() || saving} size="sm" className="gap-2">
            <Send className="h-3 w-3" />
            {saving ? "Saving..." : "Save Reflection"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
