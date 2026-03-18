import { prisma } from '@/lib/db'
import { generateDailyPlan } from '@/engine/daily-planner'
import { getStrugglingSkills } from '@/services/mastery'
import type { PlanCandidate } from '@/types'
import { todayISO } from '@/lib/utils'

export async function getTodaysPlan() {
  const today = todayISO()

  let plan = await prisma.dailyPlan.findUnique({
    where: { date: today },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  })

  if (!plan) {
    plan = await generateAndSavePlan(today)
  }

  return plan
}

export async function generateAndSavePlan(date?: string) {
  const targetDate = date || todayISO()

  // Delete existing plan for this date if regenerating
  await prisma.dailyPlan.deleteMany({ where: { date: targetDate } })

  const settings = await prisma.userSettings.findFirst()
  const dailyGoal = settings?.dailyGoalMinutes || 90

  // 1. Overdue reviews
  const dueReviews = await prisma.reviewItem.findMany({
    where: { nextReview: { lte: new Date() } },
    orderBy: { nextReview: 'asc' },
    take: 10,
  })

  const overdueReviews: PlanCandidate[] = dueReviews.map((r, i) => ({
    type: 'REVIEW',
    referenceId: r.id,
    title: r.question.length > 80 ? r.question.substring(0, 77) + '...' : r.question,
    description: 'Spaced repetition review',
    estimatedMinutes: 3,
    priority: 10 - i,
    reason: `Due for review — last interval was ${r.interval} days`,
  }))

  // 2. Next uncompleted lessons
  const completedIds = await prisma.submission.findMany({
    where: { completed: true },
    select: { lessonId: true },
    distinct: ['lessonId'],
  }).then(subs => subs.map(s => s.lessonId))

  const nextLessons = await prisma.lesson.findMany({
    where: completedIds.length > 0 ? { id: { notIn: completedIds } } : {},
    orderBy: [
      { unit: { module: { track: { sortOrder: 'asc' } } } },
      { unit: { module: { sortOrder: 'asc' } } },
      { unit: { sortOrder: 'asc' } },
      { sortOrder: 'asc' },
    ],
    take: 5,
    include: {
      unit: { include: { module: { include: { track: { include: { domain: true } } } } } },
    },
  })

  const lessonCandidates: PlanCandidate[] = nextLessons.map((l, i) => ({
    type: 'LESSON',
    referenceId: l.id,
    title: l.title,
    description: `${l.unit.module.track.domain.name} — ${l.unit.module.name}`,
    estimatedMinutes: l.estimatedMinutes,
    priority: 8 - i,
    reason: `Next lesson in ${l.unit.module.track.name}`,
  }))

  // 3. Struggle repairs (actually integrated now)
  const struggles = await getStrugglingSkills()
  const struggleRepairs: PlanCandidate[] = struggles.slice(0, 3).map((s, i) => ({
    type: 'EXERCISE',
    referenceId: s.skillId,
    title: `Repair: ${s.skillName}`,
    description: s.reason,
    estimatedMinutes: 10,
    priority: 9 - i,
    reason: s.suggestedAction,
  }))

  // 4. Active projects
  const projects = await prisma.project.findMany({
    include: {
      milestones: {
        where: { completed: false },
        take: 1,
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  const projectWork: PlanCandidate[] = projects
    .filter(p => p.milestones.length > 0)
    .slice(0, 2)
    .map(p => ({
      type: 'PROJECT',
      referenceId: p.id,
      title: `Project: ${p.name}`,
      description: p.milestones[0]?.name || 'Continue project work',
      estimatedMinutes: 20,
      priority: 5,
      reason: 'Active project milestone',
    }))

  // 5. Reflection
  const lastReflection = await prisma.reflectionEntry.findFirst({
    orderBy: { createdAt: 'desc' },
  })
  const daysSinceReflection = lastReflection
    ? (Date.now() - lastReflection.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    : 999

  const reflectionPrompts: PlanCandidate[] = daysSinceReflection >= 1 ? [{
    type: 'REFLECTION',
    referenceId: 'daily',
    title: 'Daily Reflection',
    description: 'What did you learn today? What was challenging?',
    estimatedMinutes: 5,
    priority: 2,
    reason: daysSinceReflection >= 3
      ? `No reflection in ${Math.floor(daysSinceReflection)} days`
      : 'End-of-day knowledge consolidation',
  }] : []

  const result = generateDailyPlan({
    config: {
      date: targetDate,
      dailyGoalMinutes: dailyGoal,
      weekendMode: [0, 6].includes(new Date(targetDate).getDay()),
      currentMonth: settings?.currentMonth || 1,
    },
    overdueReviews,
    nextLessons: lessonCandidates,
    struggleRepairs,
    projectWork,
    reflectionPrompts,
    recentDomainMinutes: {},
  })

  const plan = await prisma.dailyPlan.create({
    data: {
      date: targetDate,
      totalMinutes: result.totalMinutes,
      items: {
        create: result.items.map((item, index) => ({
          type: item.type,
          referenceId: item.referenceId,
          title: item.title,
          description: item.description || null,
          estimatedMinutes: item.estimatedMinutes,
          sortOrder: index,
          status: 'PENDING',
          reason: item.reason,
        })),
      },
    },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  })

  return plan
}

export async function completePlanItem(planItemId: string) {
  return prisma.dailyPlanItem.update({
    where: { id: planItemId },
    data: { status: 'COMPLETED', completedAt: new Date() },
  })
}

export async function skipPlanItem(planItemId: string) {
  return prisma.dailyPlanItem.update({
    where: { id: planItemId },
    data: { status: 'SKIPPED' },
  })
}
