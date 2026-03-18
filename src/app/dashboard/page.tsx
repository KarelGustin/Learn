import { getAnalyticsSummary, getStreak } from "@/services/analytics"
import { getDomainMasteryOverview, getStrugglingSkills } from "@/services/mastery"
import { getDueReviewCount } from "@/services/review"
import { getNextLesson, getDomains } from "@/services/curriculum"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, BookOpen, Target, RotateCcw, Clock, TrendingUp, Zap, ArrowRight, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const [analytics, streak, domainMastery, dueReviews, nextLesson, domains, struggles] = await Promise.all([
    getAnalyticsSummary(),
    getStreak(),
    getDomainMasteryOverview(),
    getDueReviewCount(),
    getNextLesson(),
    getDomains(),
    getStrugglingSkills(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Mission Control</h1>
          <p className="text-zinc-400 mt-1">Your daily robotics training dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <span className="text-lg font-bold text-zinc-50">{streak?.currentStreak || 0}</span>
            <span className="text-sm text-zinc-400">day streak</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-bold text-zinc-50">{analytics.totalHoursStudied}h</span>
            <span className="text-sm text-zinc-400">total</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20">
                <BookOpen className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-50">{analytics.lessonsCompleted}</p>
                <p className="text-xs text-zinc-400">Lessons completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-50">{analytics.accuracy}%</p>
                <p className="text-xs text-zinc-400">Exercise accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600/20">
                <RotateCcw className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-50">{dueReviews}</p>
                <p className="text-xs text-zinc-400">Reviews due</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-50">{analytics.progressPercent}%</p>
                <p className="text-xs text-zinc-400">Overall progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Next Up */}
        <div className="col-span-2 space-y-6">
          {nextLesson && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-emerald-400" />
                      Continue Learning
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {nextLesson.unit.module.track.domain.name} &gt; {nextLesson.unit.module.track.name} &gt; {nextLesson.unit.module.name}
                    </CardDescription>
                  </div>
                  <Badge variant="success">{nextLesson.estimatedMinutes} min</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/learn/${nextLesson.id}`}
                  className="group flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-emerald-600/50 hover:bg-zinc-900"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-50 group-hover:text-emerald-400 transition-colors">
                      {nextLesson.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      {nextLesson.unit.name}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Domain Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Domain Progress</CardTitle>
              <CardDescription>Mastery across all learning domains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domains.map(domain => {
                  const mastery = domainMastery.find(d => d.domainId === domain.id)
                  const totalModules = domain.tracks.reduce((s, t) => s + t.modules.length, 0)
                  return (
                    <Link
                      key={domain.id}
                      href={`/curriculum/${domain.slug}`}
                      className="block group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: domain.color }} />
                          <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-50 transition-colors">
                            {domain.name}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500">
                          {mastery ? `Avg mastery: ${mastery.avgMastery}/5` : 'Not started'} &middot; {totalModules} modules
                        </span>
                      </div>
                      <Progress
                        value={mastery ? (mastery.avgMastery / 5) * 100 : 0}
                        className="h-1.5"
                        indicatorClassName="transition-all"
                        style={{ ["--tw-bg-opacity" as string]: 1 }}
                      />
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reviews Due */}
          {dueReviews > 0 && (
            <Card className="border-yellow-600/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-yellow-400" />
                  Reviews Due
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 mb-3">
                  {dueReviews} items need review to maintain retention
                </p>
                <Link
                  href="/review"
                  className="inline-flex items-center gap-1 text-sm font-medium text-yellow-400 hover:text-yellow-300"
                >
                  Start review session <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Struggling Skills */}
          {struggles.length > 0 && (
            <Card className="border-red-600/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {struggles.slice(0, 3).map(s => (
                    <div key={s.skillId} className="rounded-lg bg-red-600/5 border border-red-600/20 p-2">
                      <p className="text-xs font-medium text-zinc-200">{s.skillName}</p>
                      <p className="text-[10px] text-zinc-500">{s.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/curriculum"
                className="flex items-center gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 transition-colors"
              >
                <BookOpen className="h-4 w-4" /> Browse curriculum
              </Link>
              <Link
                href="/journal"
                className="flex items-center gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 transition-colors"
              >
                <Target className="h-4 w-4" /> Write reflection
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 transition-colors"
              >
                <TrendingUp className="h-4 w-4" /> View projects
              </Link>
              <Link
                href="/analytics"
                className="flex items-center gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 transition-colors"
              >
                <Zap className="h-4 w-4" /> Analytics
              </Link>
            </CardContent>
          </Card>

          {/* Month Indicator */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-zinc-500">Curriculum Month</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">1 / 24</p>
                <Progress value={(1 / 24) * 100} className="mt-3 h-1" />
                <p className="text-xs text-zinc-500 mt-2">Foundations Phase</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
