import { getDomains } from "@/services/curriculum"
import { getDomainMasteryOverview } from "@/services/mastery"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, BookOpen, Code, Zap, Wrench, Brain, Gamepad2, Bot, SlidersHorizontal, Monitor, Lightbulb } from "lucide-react"
import Link from "next/link"

const domainIcons: Record<string, React.ReactNode> = {
  software: <Code className="h-6 w-6" />,
  electrical: <Zap className="h-6 w-6" />,
  mechanical: <Wrench className="h-6 w-6" />,
  ml: <Brain className="h-6 w-6" />,
  rl: <Gamepad2 className="h-6 w-6" />,
  robotics: <Bot className="h-6 w-6" />,
  controls: <SlidersHorizontal className="h-6 w-6" />,
  simulation: <Monitor className="h-6 w-6" />,
  founder: <Lightbulb className="h-6 w-6" />,
}

export default async function CurriculumPage() {
  const [domains, domainMastery] = await Promise.all([
    getDomains(),
    getDomainMasteryOverview(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50">Curriculum Map</h1>
        <p className="text-zinc-400 mt-1">Your 2-year robotics engineering learning path</p>
      </div>

      {/* Timeline */}
      <div className="flex items-center gap-2 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
        <div className="text-xs text-zinc-500 font-medium">YEAR 1</div>
        <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full bg-emerald-600 rounded-full" style={{ width: '2%' }} />
        </div>
        <div className="text-xs text-zinc-500 font-medium">YEAR 2</div>
        <div className="flex-1 h-2 rounded-full bg-zinc-800" />
        <div className="text-xs text-zinc-500 font-medium">COMPLETE</div>
      </div>

      {/* Domain Grid */}
      <div className="grid grid-cols-3 gap-4">
        {domains.map(domain => {
          const mastery = domainMastery.find(d => d.domainId === domain.id)
          const totalModules = domain.tracks.reduce((s, t) => s + t.modules.length, 0)
          const totalTracks = domain.tracks.length

          return (
            <Link key={domain.id} href={`/curriculum/${domain.slug}`}>
              <Card className="h-full transition-colors hover:border-zinc-700 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${domain.color}20` }}>
                      <span style={{ color: domain.color }}>
                        {domainIcons[domain.slug] || <BookOpen className="h-6 w-6" />}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </div>
                  <CardTitle className="text-base mt-3">{domain.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{domain.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>{totalTracks} tracks &middot; {totalModules} modules</span>
                      <span>{mastery ? `${mastery.avgMastery}/5` : '—'}</span>
                    </div>
                    <Progress
                      value={mastery ? (mastery.avgMastery / 5) * 100 : 0}
                      className="h-1"
                    />
                    <div className="flex gap-1">
                      {domain.tracks.map(track => (
                        <Badge key={track.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {track.name.length > 20 ? track.name.substring(0, 18) + '...' : track.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
