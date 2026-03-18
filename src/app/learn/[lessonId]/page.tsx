import { getLesson } from "@/services/curriculum"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"
import Link from "next/link"
import { ExerciseRunner } from "@/components/lesson/exercise-runner"
import { LessonContent } from "@/components/lesson/lesson-content"
import { LessonCompleter } from "@/components/lesson/lesson-completer"

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const lesson = await getLesson(params.lessonId)
  if (!lesson) notFound()

  const breadcrumb = `${lesson.unit.module.track.domain.name} > ${lesson.unit.module.track.name} > ${lesson.unit.module.name}`

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <p className="text-xs text-zinc-500 mb-2">{breadcrumb}</p>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-50">{lesson.title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lesson.estimatedMinutes} min
            </Badge>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <Card>
        <CardContent className="p-8">
          <LessonContent content={lesson.content} />
        </CardContent>
      </Card>

      {/* Exercises */}
      {lesson.exercises.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-50 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            Exercises ({lesson.exercises.length})
          </h2>
          {lesson.exercises.map((exercise, index) => (
            <ExerciseRunner key={exercise.id} exercise={exercise} index={index} />
          ))}
        </div>
      )}

      {/* Complete Lesson */}
      <LessonCompleter lessonId={lesson.id} exerciseCount={lesson.exercises.length} />
    </div>
  )
}
