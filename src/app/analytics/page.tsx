import { getAnalyticsSummary, getWeeklyActivity } from "@/services/analytics"
import { getDomainMasteryOverview } from "@/services/mastery"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Clock, Target, BookOpen, Flame, TrendingUp } from "lucide-react"
import { AnalyticsCharts } from "@/components/analytics/analytics-charts"

export default async function AnalyticsPage() {
  const [analytics, domainMastery, weeklyActivity] = await Promise.all([
    getAnalyticsSummary(),
    getDomainMasteryOverview(),
    getWeeklyActivity(12),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-violet-400" />
          Analytics
        </h1>
        <p className="text-zinc-400 mt-1">Track your progress and identify patterns</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-50">{analytics.totalHoursStudied}h</p>
            <p className="text-[10px] text-zinc-500">Total time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-50">{analytics.lessonsCompleted}</p>
            <p className="text-[10px] text-zinc-500">Lessons done</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-50">{analytics.accuracy}%</p>
            <p className="text-[10px] text-zinc-500">Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-5 w-5 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-50">{analytics.currentStreak}</p>
            <p className="text-[10px] text-zinc-500">Day streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-50">{analytics.totalDaysActive}</p>
            <p className="text-[10px] text-zinc-500">Days active</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Curriculum Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={analytics.progressPercent} className="flex-1 h-3" />
            <span className="text-lg font-bold text-zinc-50">{analytics.progressPercent}%</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            {analytics.lessonsCompleted} of {analytics.totalLessons} lessons completed
          </p>
        </CardContent>
      </Card>

      {/* Domain Mastery */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Mastery</CardTitle>
          <CardDescription>Average mastery level across skill domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domainMastery.map(domain => (
              <div key={domain.domainId}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: domain.color }} />
                    <span className="text-sm text-zinc-300">{domain.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">
                      {domain.masteredCount}/{domain.totalSkills} mastered
                    </span>
                    <span className="text-sm font-bold text-zinc-200">{domain.avgMastery}/5</span>
                  </div>
                </div>
                <Progress value={(domain.avgMastery / 5) * 100} className="h-2" />
              </div>
            ))}
            {domainMastery.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-4">Start learning to see mastery data here</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <AnalyticsCharts weeklyData={weeklyActivity} />
    </div>
  )
}
