import { prisma } from '@/lib/db'

export async function getStreak() {
  return prisma.streak.findFirst()
}

export async function updateStreak() {
  const today = new Date().toISOString().split('T')[0]
  let streak = await prisma.streak.findFirst()

  if (!streak) {
    streak = await prisma.streak.create({
      data: { currentStreak: 1, longestStreak: 1, lastActiveDate: today, totalDaysActive: 1 },
    })
    return streak
  }

  if (streak.lastActiveDate === today) return streak

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const isConsecutive = streak.lastActiveDate === yesterdayStr
  const newCurrent = isConsecutive ? streak.currentStreak + 1 : 1
  const newLongest = Math.max(streak.longestStreak, newCurrent)

  return prisma.streak.update({
    where: { id: streak.id },
    data: {
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastActiveDate: today,
      totalDaysActive: streak.totalDaysActive + 1,
    },
  })
}

export async function getAnalyticsSummary() {
  const [
    totalLessons,
    completedSubmissions,
    totalExercises,
    totalAttempts,
    correctAttempts,
    totalReviews,
    sessions,
    streak,
  ] = await Promise.all([
    prisma.lesson.count(),
    prisma.submission.count({ where: { completed: true } }),
    prisma.exercise.count(),
    prisma.attempt.count(),
    prisma.attempt.count({ where: { correct: true } }),
    prisma.reviewItem.count(),
    prisma.studySession.findMany({ orderBy: { startedAt: 'desc' }, take: 30 }),
    prisma.streak.findFirst(),
  ])

  const totalMinutesStudied = sessions.reduce((s, session) => s + session.totalMinutes, 0)
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

  return {
    totalLessons,
    lessonsCompleted: completedSubmissions,
    progressPercent: totalLessons > 0 ? Math.round((completedSubmissions / totalLessons) * 100) : 0,
    totalExercises,
    totalAttempts,
    accuracy,
    totalReviews,
    totalMinutesStudied,
    totalHoursStudied: Math.round(totalMinutesStudied / 60 * 10) / 10,
    currentStreak: streak?.currentStreak || 0,
    longestStreak: streak?.longestStreak || 0,
    totalDaysActive: streak?.totalDaysActive || 0,
  }
}

export async function getWeeklyActivity(weeks: number = 12) {
  const sessions = await prisma.studySession.findMany({
    orderBy: { startedAt: 'desc' },
    take: weeks * 7,
  })

  // Group by week
  const weeklyData: { week: string; minutes: number; lessons: number; reviews: number }[] = []
  const now = new Date()

  for (let w = weeks - 1; w >= 0; w--) {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - (w * 7 + now.getDay()))
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const weekSessions = sessions.filter(s =>
      s.startedAt >= weekStart && s.startedAt < weekEnd
    )

    weeklyData.push({
      week: weekStart.toISOString().split('T')[0],
      minutes: weekSessions.reduce((s, session) => s + session.totalMinutes, 0),
      lessons: weekSessions.reduce((s, session) => s + session.lessonsCompleted, 0),
      reviews: weekSessions.reduce((s, session) => s + session.reviewsDone, 0),
    })
  }

  return weeklyData
}
