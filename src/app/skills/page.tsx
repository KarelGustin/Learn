import { getSkillsWithMastery } from "@/services/mastery"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch } from "lucide-react"
import { masteryLabel, masteryColor } from "@/lib/utils"

export default async function SkillsPage() {
  const skills = await getSkillsWithMastery()

  // Group by domain
  const domainGroups = new Map<string, { name: string; color: string; skills: typeof skills }>()
  for (const skill of skills) {
    const key = skill.domain.id
    if (!domainGroups.has(key)) {
      domainGroups.set(key, { name: skill.domain.name, color: skill.domain.color, skills: [] })
    }
    domainGroups.get(key)!.skills.push(skill)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-3">
          <GitBranch className="h-8 w-8 text-cyan-400" />
          Skill Graph
        </h1>
        <p className="text-zinc-400 mt-1">All skills across your robotics learning path with mastery levels</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-zinc-500">Mastery levels:</span>
        {[0, 1, 2, 3, 4, 5].map(level => (
          <span key={level} className={`${masteryColor(level)} font-medium`}>
            {level} — {masteryLabel(level)}
          </span>
        ))}
      </div>

      {/* Skills by domain */}
      {Array.from(domainGroups.entries()).map(([domainId, group]) => (
        <Card key={domainId}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: group.color }} />
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <Badge variant="secondary" className="text-[10px]">{group.skills.length} skills</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {group.skills.map(skill => {
                const mastery = skill.masteryRecord
                const level = mastery?.level ?? 0
                const deps = skill.dependsOn.length

                return (
                  <div
                    key={skill.id}
                    className="rounded-lg border border-zinc-800 p-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-zinc-200 truncate">{skill.name}</h4>
                      <span className={`text-xs font-bold ${masteryColor(level)}`}>
                        {level}/5
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate">{skill.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {skill.category}
                      </Badge>
                      {deps > 0 && (
                        <span className="text-[10px] text-zinc-600">{deps} prereqs</span>
                      )}
                    </div>
                    {/* Mastery bar */}
                    <div className="mt-2 h-1 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${(level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {skills.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <GitBranch className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">No skills loaded yet. Run the seed script to populate the curriculum.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
