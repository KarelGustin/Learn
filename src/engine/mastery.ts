import { type DifficultyTier, type MasteryUpdate } from '@/types'
import { clamp } from '@/lib/utils'

interface MasteryState {
  level: number
  confidence: number
  totalAttempts: number
  correctAttempts: number
  streakCorrect: number
  streakWrong: number
  lastPracticed: Date | null
}

interface MasteryResult {
  level: number
  confidence: number
  totalAttempts: number
  correctAttempts: number
  streakCorrect: number
  streakWrong: number
  levelChanged: boolean
  direction: 'up' | 'down' | 'none'
}

const DIFFICULTY_MULTIPLIER: Record<DifficultyTier, number> = {
  INTRODUCTORY: 0.7,
  FOUNDATIONAL: 0.85,
  INTERMEDIATE: 1.0,
  ADVANCED: 1.15,
  EXPERT: 1.3,
}

const LEVEL_THRESHOLDS = [0, 0.3, 0.5, 0.65, 0.8, 0.92]

export function updateMastery(
  state: MasteryState,
  update: MasteryUpdate
): MasteryResult {
  const newTotalAttempts = state.totalAttempts + 1
  const newCorrectAttempts = state.correctAttempts + (update.wasCorrect ? 1 : 0)
  const newStreakCorrect = update.wasCorrect ? state.streakCorrect + 1 : 0
  const newStreakWrong = update.wasCorrect ? 0 : state.streakWrong + 1

  // Calculate weighted accuracy
  const rawAccuracy = newCorrectAttempts / newTotalAttempts
  const multiplier = DIFFICULTY_MULTIPLIER[update.difficulty] || 1.0
  const weightedAccuracy = Math.min(1, rawAccuracy * multiplier)

  // Determine new level
  let newLevel = state.level

  // Not enough data to advance beyond 1
  const maxLevel = newTotalAttempts < 3 ? 1 : 5

  // Check for level up
  for (let l = state.level + 1; l <= Math.min(5, maxLevel); l++) {
    if (weightedAccuracy >= LEVEL_THRESHOLDS[l]) {
      newLevel = l
      break // Only go up by 1
    }
  }

  // Check for level down (struggle)
  if (newStreakWrong >= 3 && state.level > 0) {
    newLevel = state.level - 1
  }

  newLevel = clamp(newLevel, 0, 5)

  // Update confidence with Bayesian-like update
  const likelihood = update.wasCorrect ? 0.85 : 0.25
  const prior = state.confidence
  const posterior = (prior * likelihood) / (prior * likelihood + (1 - prior) * (1 - likelihood))

  // Apply time decay if there was a gap
  let confidence = posterior
  if (state.lastPracticed) {
    const daysSince = (Date.now() - state.lastPracticed.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince > 1) {
      confidence *= Math.exp(-daysSince / 30)
    }
  }

  // Factor in self-reported confidence alignment
  const selfNormalized = update.confidence / 5 // 0-1
  const alignment = 1 - Math.abs(selfNormalized - (update.wasCorrect ? 0.8 : 0.2))
  confidence = confidence * 0.85 + (confidence * alignment * 0.15)

  confidence = clamp(confidence, 0.05, 0.99)

  return {
    level: newLevel,
    confidence,
    totalAttempts: newTotalAttempts,
    correctAttempts: newCorrectAttempts,
    streakCorrect: newStreakCorrect,
    streakWrong: newStreakWrong,
    levelChanged: newLevel !== state.level,
    direction: newLevel > state.level ? 'up' : newLevel < state.level ? 'down' : 'none',
  }
}

export function computeLessonScore(
  exerciseResults: { correct: boolean; difficulty: DifficultyTier; hintsUsed: number; timeMs: number; expectedTimeMs: number }[]
): number {
  if (exerciseResults.length === 0) return 0.5

  let totalWeight = 0
  let weightedScore = 0

  for (const r of exerciseResults) {
    const diffWeight = DIFFICULTY_MULTIPLIER[r.difficulty] || 1.0
    const baseScore = r.correct ? 1.0 : 0.0

    // Penalize hint usage
    const hintPenalty = Math.min(r.hintsUsed * 0.1, 0.3)

    // Speed bonus/penalty
    const timeRatio = r.expectedTimeMs > 0 ? r.timeMs / r.expectedTimeMs : 1
    const speedFactor = timeRatio < 0.5 ? 1.1 : timeRatio > 2.0 ? 0.85 : 1.0

    const score = clamp((baseScore - hintPenalty) * speedFactor, 0, 1)
    weightedScore += score * diffWeight
    totalWeight += diffWeight
  }

  return totalWeight > 0 ? weightedScore / totalWeight : 0.5
}

export function shouldRemediate(state: MasteryState): boolean {
  return (
    state.streakWrong >= 3 ||
    (state.confidence < 0.3 && state.totalAttempts >= 5) ||
    (state.level <= 1 && state.totalAttempts >= 10)
  )
}

export function shouldAccelerate(state: MasteryState): boolean {
  return (
    state.level >= 4 &&
    state.confidence > 0.8 &&
    state.streakCorrect >= 5
  )
}
