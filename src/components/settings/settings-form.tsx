"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface Settings {
  id: string
  displayName: string
  dailyGoalMinutes: number
  theme: string
  currentMonth: number
  onboardingComplete: boolean
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [name, setName] = useState(settings.displayName)
  const [goal, setGoal] = useState(settings.dailyGoalMinutes)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: name, dailyGoalMinutes: goal }),
      })
      router.refresh()
    } catch {
      // handle error
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-zinc-400 block mb-1">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-400 block mb-1">Daily Goal (minutes)</label>
          <input
            type="number"
            value={goal}
            onChange={e => setGoal(parseInt(e.target.value) || 90)}
            min={15}
            max={480}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
          <p className="text-xs text-zinc-600 mt-1">Recommended: 90-180 minutes per day</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
            <Save className="h-3 w-3" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
