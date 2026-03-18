import { clamp } from '@/lib/utils'

interface SessionMetrics {
  lessonsCompleted: number
  exercisesAttempted: number
  exercisesCorrect: number
  reviewsCompleted: number
  reviewsCorrect: number
  totalMinutes: number
  goalMinutes: number
}

/**
 * Compute a daily performance score (0-100).
 */
export function computeDailyScore(metrics: SessionMetrics): number {
  if (metrics.totalMinutes === 0) return 0

  // Completion factor: did you meet your time goal?
  const completionRatio = Math.min(metrics.totalMinutes / Math.max(metrics.goalMinutes, 1), 1.5)
  const completionScore = Math.min(completionRatio * 40, 40)

  // Accuracy factor
  const totalAttempts = metrics.exercisesAttempted + metrics.reviewsCompleted
  const totalCorrect = metrics.exercisesCorrect + metrics.reviewsCorrect
  const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0.5
  const accuracyScore = accuracy * 35

  // Activity factor: doing lessons + reviews + exercises
  const activityTypes = [
    metrics.lessonsCompleted > 0 ? 1 : 0,
    metrics.exercisesAttempted > 0 ? 1 : 0,
    metrics.reviewsCompleted > 0 ? 1 : 0,
  ].reduce((s, v) => s + v, 0)
  const varietyScore = (activityTypes / 3) * 25

  return Math.round(clamp(completionScore + accuracyScore + varietyScore, 0, 100))
}

/**
 * Compute momentum indicator (-1 to 1).
 * Positive = improving, negative = declining.
 */
export function computeMomentum(
  recentScores: number[] // daily scores, most recent last
): number {
  if (recentScores.length < 3) return 0

  const recent3 = recentScores.slice(-3)
  const previous3 = recentScores.slice(-6, -3)

  if (previous3.length === 0) return 0

  const recentAvg = recent3.reduce((s, v) => s + v, 0) / recent3.length
  const previousAvg = previous3.reduce((s, v) => s + v, 0) / previous3.length

  if (previousAvg === 0) return recentAvg > 0 ? 1 : 0

  const delta = (recentAvg - previousAvg) / previousAvg
  return clamp(delta, -1, 1)
}

/**
 * Retention confidence score: how well is the learner retaining reviewed material?
 */
export function computeRetentionHealth(
  reviewResults: { grade: number; efactor: number }[]
): number {
  if (reviewResults.length === 0) return 0.5

  const avgGrade = reviewResults.reduce((s, r) => s + r.grade, 0) / reviewResults.length
  const avgEfactor = reviewResults.reduce((s, r) => s + r.efactor, 0) / reviewResults.length

  // Normalize: grade 3+ is passing, efactor 2.5 is default
  const gradeHealth = Math.min(avgGrade / 4, 1)
  const efactorHealth = Math.min(avgEfactor / 2.5, 1)

  return Math.round((gradeHealth * 0.6 + efactorHealth * 0.4) * 100) / 100
}
