import { getProjects } from "@/services/curriculum"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FolderKanban, Clock, CheckCircle, Circle } from "lucide-react"
import Link from "next/link"
import { difficultyLabel } from "@/lib/utils"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-3">
          <FolderKanban className="h-8 w-8 text-blue-400" />
          Project Hub
        </h1>
        <p className="text-zinc-400 mt-1">Build real robotics systems through structured projects</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {projects.map(project => {
          const completedMilestones = project.milestones.filter(m => m.completed).length
          const totalMilestones = project.milestones.length
          const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="h-full transition-colors hover:border-zinc-700 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px]" style={{ borderColor: project.module.track.domain.color }}>
                      {project.module.track.domain.name}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {difficultyLabel(project.difficulty)}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{project.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {project.estimatedHours}h
                      </span>
                      <span>{completedMilestones}/{totalMilestones} milestones</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    <div className="space-y-1">
                      {project.milestones.slice(0, 3).map(m => (
                        <div key={m.id} className="flex items-center gap-2 text-xs">
                          {m.completed
                            ? <CheckCircle className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                            : <Circle className="h-3 w-3 text-zinc-600 flex-shrink-0" />
                          }
                          <span className={m.completed ? "text-zinc-500 line-through" : "text-zinc-400"}>
                            {m.name}
                          </span>
                        </div>
                      ))}
                      {project.milestones.length > 3 && (
                        <p className="text-[10px] text-zinc-600 pl-5">+{project.milestones.length - 3} more</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}

        {projects.length === 0 && (
          <Card className="col-span-2">
            <CardContent className="p-12 text-center">
              <FolderKanban className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-400">No projects yet</h3>
              <p className="text-sm text-zinc-500 mt-1">Projects will appear as you progress through the curriculum</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
