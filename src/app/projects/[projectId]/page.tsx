import { getProject } from "@/services/curriculum"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { difficultyLabel } from "@/lib/utils"
import { MilestoneToggle } from "@/components/projects/milestone-toggle"

export default async function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const project = await getProject(params.projectId)
  if (!project) notFound()

  const completedCount = project.milestones.filter(m => m.completed).length
  const progress = project.milestones.length > 0 ? (completedCount / project.milestones.length) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-2" style={{ borderColor: project.module.track.domain.color }}>
              {project.module.track.domain.name}
            </Badge>
            <h1 className="text-2xl font-bold text-zinc-50">{project.name}</h1>
          </div>
          <div className="text-right">
            <Badge variant="secondary">{difficultyLabel(project.difficulty)}</Badge>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {project.estimatedHours}h estimated
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="lesson-content text-sm text-zinc-300 whitespace-pre-wrap">
            {project.description}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="flex items-center gap-4">
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-sm font-medium text-zinc-400">{completedCount}/{project.milestones.length}</span>
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Milestones</CardTitle>
          <CardDescription>Complete each milestone to finish the project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {project.milestones.map((milestone, i) => (
              <MilestoneToggle key={milestone.id} milestone={milestone} index={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
