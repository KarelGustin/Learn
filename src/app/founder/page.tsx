import { getFounderPrompts } from "@/services/journal"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Target, TrendingUp, Shield, Rocket, Users, DollarSign } from "lucide-react"

const categoryIcons: Record<string, React.ReactNode> = {
  vision: <Rocket className="h-4 w-4" />,
  risk: <Shield className="h-4 w-4" />,
  market: <TrendingUp className="h-4 w-4" />,
  team: <Users className="h-4 w-4" />,
  product: <Target className="h-4 w-4" />,
  growth: <DollarSign className="h-4 w-4" />,
}

const categoryColors: Record<string, string> = {
  vision: "text-purple-400 bg-purple-600/20",
  risk: "text-red-400 bg-red-600/20",
  market: "text-blue-400 bg-blue-600/20",
  team: "text-green-400 bg-green-600/20",
  product: "text-yellow-400 bg-yellow-600/20",
  growth: "text-cyan-400 bg-cyan-600/20",
}

export default async function FounderPage() {
  const prompts = await getFounderPrompts(104)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-3">
          <Lightbulb className="h-8 w-8 text-amber-400" />
          Founder Thinking
        </h1>
        <p className="text-zinc-400 mt-1">Connect your technical learning to real-world product and business thinking</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Every week, you&apos;ll receive a founder prompt that connects what you&apos;re learning to real robotics
            business thinking. The goal is to train you to think like a robotics founder from day one — not just
            an engineer. Consider: what problems does this technology solve? Who would pay for it? What&apos;s the
            hardest part to get right?
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {prompts.map(prompt => (
          <Card key={prompt.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${categoryColors[prompt.category] || 'text-zinc-400 bg-zinc-800'}`}>
                  {categoryIcons[prompt.category] || <Lightbulb className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px]">Week {prompt.weekNumber}</Badge>
                    <Badge variant="outline" className="text-[10px] capitalize">{prompt.category}</Badge>
                  </div>
                  <p className="text-sm font-medium text-zinc-200">{prompt.prompt}</p>
                  <p className="text-xs text-zinc-500 mt-1">{prompt.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
