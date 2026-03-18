import { type DifficultyTier, type MasteryUpdate } from '@/types'
import { clamp } from '@/lib/utils'

export interface MasteryState {
  level: number
  confidence: number
  totalAttempts: number
  correctAttempts: number
  streakCorrect: number
  streakWrong: number
  velocity: number
  lastPracticed: Date | null
  lastLevelChange: Date | null
}

export interface MasteryResult {
  level: number
  confidence: number
  totalAttempts: number
  correctAttempts: number
  streakCorrect: number
  streakWrong: number
  velocity: number
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

// Weighted accuracy thresholds for each mastery level
const LEVEL_THRESHOLDS = [0, 0.3, 0.5, 0.65, 0.8, 0.92]

// Minimum attempts before promoting to each level
const MIN_ATTEMPTS_FOR_LEVEL = [0, 1, 3, 6, 10, 15]

export function updateMastery(
  state: MasteryState,
  update: MasteryUpdate
): MasteryResult {
  const newTotalAttempts = state.totalAttempts + 1
  const newCorrectAttempts = state.correctAttempts + (update.wasCorrect ? 1 : 0)
  const newStreakCorrect = update.wasCorrect ? state.streakCorrect + 1 : 0
  const newStreakWrong = update.wasCorrect ? 0 : state.streakWrong + 1

  // Use exponentially-weighted recent accuracy (last N matter more)
  const recencyWeight = 0.7 // how much recent performance matters vs lifetime
  const lifetimeAccuracy = newCorrectAttempts / newTotalAttempts
  const recentSignal = update.wasCorrect ? 1.0 : 0.0
  const blendedAccuracy = lifetimeAccuracy * (1 - recencyWeight) + recentSignal * recencyWeight

  const multiplier = DIFFICULTY_MULTIPLIER[update.difficulty] || 1.0
  const weightedAccuracy = Math.min(1, blendedAccuracy * multiplier)

  let newLevel = state.level

  // Level up: must exceed threshold AND have enough attempts
  for (let l = state.level + 1; l <= 5; l++) {
    if (
      weightedAccuracy >= LEVEL_THRESHOLDS[l] &&
      newTotalAttempts >= MIN_ATTEMPTS_FOR_LEVEL[l]
    ) {
      newLevel = l
      break // only +1 per update
    }
  }

  // Level down on sustained failure
  if (newStreakWrong >= 3 && state.level > 0) {
    newLevel = state.level - 1
  }

  // Also level down if accuracy drops well below current level threshold
  if (
    newTotalAttempts >= 5 &&
    lifetimeAccuracy < LEVEL_THRESHOLDS[state.level] * 0.7 &&
    state.level > 0
  ) {
    newLevel = state.level - 1
  }

  newLevel = clamp(newLevel, 0, 5)

  // Bayesian confidence update
  const likelihood = update.wasCorrect ? 0.85 : 0.25
  const prior = state.confidence
  let confidence = (prior * likelihood) / (prior * likelihood + (1 - prior) * (1 - likelihood))

  // Time decay: confidence erodes if skill isn't practiced
  if (state.lastPracticed) {
    const daysSince = (Date.now() - state.lastPracticed.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince > 1) {
      confidence *= Math.exp(-daysSince / 30)
    }
  }

  // Self-reported confidence alignment factor
  // If self-report disagrees with outcome, slightly reduce confidence
  const selfNormalized = update.confidence / 5
  const outcomeExpected = update.wasCorrect ? 0.8 : 0.2
  const alignment = 1 - Math.abs(selfNormalized - outcomeExpected)
  confidence = confidence * 0.85 + confidence * alignment * 0.15

  confidence = clamp(confidence, 0.05, 0.99)

  // Velocity: exponential moving average of level changes
  // Positive = improving, negative = declining
  const levelDelta = newLevel - state.level
  const prevVelocity = state.velocity || 0
  const velocity = prevVelocity * 0.8 + levelDelta * 0.2

  return {
    level: newLevel,
    confidence,
    totalAttempts: newTotalAttempts,
    correctAttempts: newCorrectAttempts,
    streakCorrect: newStreakCorrect,
    streakWrong: newStreakWrong,
    velocity: Math.round(velocity * 1000) / 1000,
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
    const hintPenalty = Math.min(r.hintsUsed * 0.1, 0.3)
    const timeRatio = r.expectedTimeMs > 0 ? r.timeMs / r.expectedTimeMs : 1
    const speedFactor = timeRatio < 0.5 ? 1.1 : timeRatio > 2.0 ? 0.85 : 1.0
    const score = clamp((baseScore - hintPenalty) * speedFactor, 0, 1)
    weightedScore += score * diffWeight
    totalWeight += diffWeight
  }

  return totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) / 100 : 0.5
}

export function shouldRemediate(state: MasteryState): boolean {
  return (
    state.streakWrong >= 3 ||
    (state.confidence < 0.3 && state.totalAttempts >= 5) ||
    (state.level <= 1 && state.totalAttempts >= 10) ||
    (state.velocity < -0.1 && state.totalAttempts >= 8)
  )
}

export function shouldAccelerate(state: MasteryState): boolean {
  return (
    state.level >= 4 &&
    state.confidence > 0.8 &&
    state.streakCorrect >= 5 &&
    state.velocity >= 0
  )
}
