import { getDomainBySlug } from "@/services/curriculum"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ChevronRight, BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { difficultyLabel } from "@/lib/utils"

export default async function DomainPage({ params }: { params: { domainSlug: string } }) {
  const domain = await getDomainBySlug(params.domainSlug)
  if (!domain) notFound()

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/curriculum" className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: domain.color }} />
            <h1 className="text-3xl font-bold text-zinc-50">{domain.name}</h1>
          </div>
          <p className="text-zinc-400 mt-1">{domain.description}</p>
        </div>
      </div>

      <div className="space-y-6">
        {domain.tracks.map(track => (
          <Card key={track.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{track.name}</CardTitle>
                  <CardDescription>{track.description}</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  Months {track.startMonth}-{track.endMonth}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {track.modules.map(mod => {
                  const unitCount = mod.units?.length || 0
                  return (
                    <div key={mod.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-zinc-500" />
                        <div>
                          <h4 className="text-sm font-medium text-zinc-200">{mod.name}</h4>
                          <p className="text-xs text-zinc-500">{unitCount} units &middot; {difficultyLabel(mod.difficulty)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="h-3 w-3" />
                          {mod.estimatedHours}h
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-600" />
                      </div>
                    </div>
                  )
                })}
                {track.modules.length === 0 && (
                  <p className="text-sm text-zinc-500 italic py-2">Modules coming soon — content unlocks as you progress</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
