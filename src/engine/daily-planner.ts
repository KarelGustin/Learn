import type { PlanCandidate, DailyPlanConfig, PlanItemType } from '@/types'

interface PlannerInput {
  config: DailyPlanConfig
  overdueReviews: PlanCandidate[]
  nextLessons: PlanCandidate[]
  struggleRepairs: PlanCandidate[]
  projectWork: PlanCandidate[]
  reflectionPrompts: PlanCandidate[]
  recentDomainMinutes: Record<string, number> // domain -> minutes in past 7 days
}

interface GeneratedPlan {
  items: PlanCandidate[]
  totalMinutes: number
  breakdown: Record<PlanItemType, number>
  warnings: string[]
}

/**
 * Generate an adaptive daily plan based on current learner state.
 *
 * Budget allocation (flexible):
 *   - 25% overdue reviews
 *   - 40-50% new lessons (core progression)
 *   - 20% struggle repair
 *   - 15% project work
 *   - 5-10% reflection
 *
 * Sequencing: reviews → lessons → projects → reflection
 */
export function generateDailyPlan(input: PlannerInput): GeneratedPlan {
  const { config, overdueReviews, nextLessons, struggleRepairs, projectWork, reflectionPrompts } = input

  let budget = config.dailyGoalMinutes
  if (config.weekendMode) {
    budget = Math.round(budget * 0.6)
  }

  const items: PlanCandidate[] = []
  const warnings: string[] = []
  let remaining = budget

  // Phase 1: Overdue reviews (up to 25% of budget)
  const reviewBudget = Math.round(budget * 0.25)
  let reviewUsed = 0
  const sortedReviews = [...overdueReviews].sort((a, b) => b.priority - a.priority)
  for (const review of sortedReviews) {
    if (reviewUsed + review.estimatedMinutes > reviewBudget) continue
    items.push({ ...review, type: 'REVIEW' })
    reviewUsed += review.estimatedMinutes
    remaining -= review.estimatedMinutes
  }

  // Phase 2: Struggle repairs (up to 20% of budget)
  const repairBudget = Math.round(budget * 0.2)
  let repairUsed = 0
  for (const repair of struggleRepairs) {
    if (repairUsed + repair.estimatedMinutes > repairBudget) continue
    items.push(repair)
    repairUsed += repair.estimatedMinutes
    remaining -= repair.estimatedMinutes
  }

  if (struggleRepairs.length > 0 && repairUsed === 0) {
    warnings.push('Struggle areas identified but no time available — consider extending today\'s session')
  }

  // Phase 3: Core lessons (biggest chunk of remaining budget)
  const lessonBudget = Math.round(remaining * 0.7)
  let lessonUsed = 0
  for (const lesson of nextLessons) {
    if (lessonUsed + lesson.estimatedMinutes > lessonBudget) continue
    items.push(lesson)
    lessonUsed += lesson.estimatedMinutes
    remaining -= lesson.estimatedMinutes
  }

  // Phase 4: Project work (remaining budget minus reflection)
  const reflectionReserve = 10
  const projectBudget = Math.max(0, remaining - reflectionReserve)
  let projectUsed = 0
  for (const project of projectWork) {
    if (projectUsed + project.estimatedMinutes > projectBudget) continue
    items.push(project)
    projectUsed += project.estimatedMinutes
    remaining -= project.estimatedMinutes
  }

  // Phase 5: Reflection (last 5-10 minutes)
  for (const prompt of reflectionPrompts.slice(0, 1)) {
    if (remaining >= 5) {
      items.push(prompt)
      remaining -= prompt.estimatedMinutes
    }
  }

  // Sort items by type order: REVIEW → LESSON → EXERCISE → PROJECT → REFLECTION
  const typeOrder: Record<string, number> = {
    REVIEW: 0,
    LESSON: 1,
    EXERCISE: 2,
    PROJECT: 3,
    REFLECTION: 4,
  }
  items.sort((a, b) => (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99))

  // Calculate breakdown
  const breakdown = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + item.estimatedMinutes
    return acc
  }, {} as Record<PlanItemType, number>)

  const totalMinutes = items.reduce((s, i) => s + i.estimatedMinutes, 0)

  // Warnings
  if (overdueReviews.length > 10) {
    warnings.push(`${overdueReviews.length} overdue reviews — consider a dedicated review session`)
  }
  if (totalMinutes < budget * 0.5) {
    warnings.push('Fewer items than usual — you may be running low on available content for today')
  }

  return { items, totalMinutes, breakdown, warnings }
}

/**
 * Calculate domain balance recommendation.
 * Returns domains that are underserved relative to the current curriculum phase.
 */
export function getDomainImbalances(
  recentMinutes: Record<string, number>,
  targetWeights: Record<string, number>
): { domainId: string; currentPercent: number; targetPercent: number; deficit: number }[] {
  const totalRecent = Object.values(recentMinutes).reduce((s, v) => s + v, 0)
  if (totalRecent === 0) return []

  const imbalances: { domainId: string; currentPercent: number; targetPercent: number; deficit: number }[] = []

  for (const [domainId, target] of Object.entries(targetWeights)) {
    const current = (recentMinutes[domainId] || 0) / totalRecent
    const deficit = target - current
    if (deficit > 0.05) { // Only flag if >5% underserved
      imbalances.push({
        domainId,
        currentPercent: Math.round(current * 100),
        targetPercent: Math.round(target * 100),
        deficit: Math.round(deficit * 100),
      })
    }
  }

  return imbalances.sort((a, b) => b.deficit - a.deficit)
}
