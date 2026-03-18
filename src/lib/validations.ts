import { z } from 'zod'

export const attemptSchema = z.object({
  exerciseId: z.string().min(1),
  answer: z.union([z.string(), z.number(), z.boolean()]).transform(String),
  correct: z.boolean(),
  timeSpentMs: z.number().int().min(0).default(0),
  hints: z.number().int().min(0).default(0),
  confidence: z.number().int().min(1).max(5).default(3),
})

export const submissionSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean().default(true),
  score: z.number().min(0).max(1).optional(),
  timeSpentMs: z.number().int().min(0).default(0),
})

export const reviewGradeSchema = z.object({
  reviewItemId: z.string().min(1),
  grade: z.number().int().min(0).max(5),
})

export const reflectionSchema = z.object({
  content: z.string().min(1).max(10000),
  mood: z.number().int().min(1).max(5).optional(),
  whatWentWell: z.string().max(2000).optional(),
  whatWasHard: z.string().max(2000).optional(),
  whatILearned: z.string().max(2000).optional(),
  tags: z.string().max(500).optional(),
  promptId: z.string().optional(),
})

export const settingsSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  dailyGoalMinutes: z.number().int().min(15).max(480).optional(),
  theme: z.enum(['dark', 'light']).optional(),
  currentMonth: z.number().int().min(1).max(24).optional(),
  onboardingComplete: z.boolean().optional(),
  weekendMode: z.boolean().optional(),
})

export const milestoneSchema = z.object({
  milestoneId: z.string().min(1),
  completed: z.boolean(),
})
