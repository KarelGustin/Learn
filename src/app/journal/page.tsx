import { getReflections } from "@/services/journal"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenSquare, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { JournalEditor } from "@/components/journal/journal-editor"

const moodEmojis: Record<number, string> = { 1: 'Rough', 2: 'Hard', 3: 'Okay', 4: 'Good', 5: 'Great' }

export default async function JournalPage() {
  const reflections = await getReflections(50)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-3">
          <PenSquare className="h-8 w-8 text-indigo-400" />
          Reflection Journal
        </h1>
        <p className="text-zinc-400 mt-1">Track your learning journey, struggles, and insights</p>
      </div>

      {/* New Entry */}
      <JournalEditor />

      {/* Past Entries */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-200">Past Reflections</h2>
        {reflections.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <PenSquare className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No reflections yet. Write your first one above!</p>
            </CardContent>
          </Card>
        ) : (
          reflections.map(entry => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-zinc-500" />
                    <span className="text-xs text-zinc-500">{formatDate(entry.date)}</span>
                  </div>
                  {entry.mood && (
                    <Badge variant="secondary" className="text-[10px]">
                      {moodEmojis[entry.mood] || entry.mood}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{entry.content}</p>
                {entry.whatILearned && (
                  <div className="mt-2 rounded bg-zinc-800/50 p-2">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">What I Learned</p>
                    <p className="text-xs text-zinc-400">{entry.whatILearned}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
