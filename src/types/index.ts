export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5

export type ExerciseType =
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'CODE_CHALLENGE'

export type DifficultyTier =
  | 'INTRODUCTORY'
  | 'FOUNDATIONAL'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'EXPERT'

export type PlanItemType = 'LESSON' | 'REVIEW' | 'PROJECT' | 'EXERCISE' | 'REFLECTION'
export type PlanItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'
export type ContentFormat = 'MARKDOWN' | 'VIDEO_URL' | 'INTERACTIVE'

export interface MasteryUpdate {
  skillId: string
  wasCorrect: boolean
  difficulty: DifficultyTier
  timeSpentMs: number
  hintsUsed: number
  confidence: number // 1-5 self-reported
}

export interface ReviewGrade {
  reviewItemId: string
  grade: 0 | 1 | 2 | 3 | 4 | 5
}

export interface DailyPlanConfig {
  date: string
  dailyGoalMinutes: number
  weekendMode: boolean
  currentMonth: number
}

export interface StruggleReport {
  skillId: string
  skillName: string
  reason: string
  severity: 'low' | 'medium' | 'high'
  suggestedAction: string
}

export interface AccelerationResult {
  domainId: string
  canAccelerate: boolean
  avgMastery: number
  recentAccuracy: number
  suggestedSkipTo?: string
}

export interface PlanCandidate {
  type: PlanItemType
  referenceId: string
  title: string
  description?: string
  estimatedMinutes: number
  priority: number // higher = more important
  reason: string
}

export interface DomainProgress {
  domainId: string
  domainName: string
  color: string
  totalSkills: number
  avgMastery: number
  lessonsCompleted: number
  totalLessons: number
  percentComplete: number
}
