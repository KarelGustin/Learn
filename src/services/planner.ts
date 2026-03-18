import { prisma } from '@/lib/db'
import { generateDailyPlan } from '@/engine/daily-planner'
import type { PlanCandidate } from '@/types'
import { todayISO } from '@/lib/utils'

export async function getTodaysPlan() {
  const today = todayISO()

  let plan = await prisma.dailyPlan.findUnique({
    where: { date: today },
    include: {
      items: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!plan) {
    plan = await generateAndSavePlan(today)
  }

  return plan
}

export async function generateAndSavePlan(date?: string) {
  const targetDate = date || todayISO()

  // Get user settings
  const settings = await prisma.userSettings.findFirst()
  const dailyGoal = settings?.dailyGoalMinutes || 90

  // Get overdue reviews
  const dueReviews = await prisma.reviewItem.findMany({
    where: { nextReview: { lte: new Date() } },
    take: 10,
  })

  const overdueReviews: PlanCandidate[] = dueReviews.map(r => ({
    type: 'REVIEW',
    referenceId: r.id,
    title: r.question.substring(0, 80),
    description: 'Spaced repetition review',
    estimatedMinutes: 5,
    priority: 10,
    reason: 'Due for review to maintain retention',
  }))

  // Get next uncompleted lessons
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
    description: `${l.unit.module.track.domain.name} > ${l.unit.module.name}`,
    estimatedMinutes: l.estimatedMinutes,
    priority: 8 - i,
    reason: `Next lesson in ${l.unit.module.track.name} curriculum`,
  }))

  // Get active projects
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

  // Reflection prompt
  const reflectionPrompts: PlanCandidate[] = [{
    type: 'REFLECTION',
    referenceId: 'daily',
    title: 'Daily Reflection',
    description: 'What did you learn today? What was challenging?',
    estimatedMinutes: 5,
    priority: 2,
    reason: 'End-of-day consolidation and self-assessment',
  }]

  const result = generateDailyPlan({
    config: {
      date: targetDate,
      dailyGoalMinutes: dailyGoal,
      weekendMode: [0, 6].includes(new Date(targetDate).getDay()),
      currentMonth: settings?.currentMonth || 1,
    },
    overdueReviews,
    nextLessons: lessonCandidates,
    struggleRepairs: [],
    projectWork,
    reflectionPrompts,
    recentDomainMinutes: {},
  })

  // Save to database
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
    include: {
      items: { orderBy: { sortOrder: 'asc' } },
    },
  })

  return plan
}

export async function completePlanItem(planItemId: string) {
  return prisma.dailyPlanItem.update({
    where: { id: planItemId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  })
}

export async function skipPlanItem(planItemId: string) {
  return prisma.dailyPlanItem.update({
    where: { id: planItemId },
    data: { status: 'SKIPPED' },
  })
}
