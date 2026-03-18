import { prisma } from '@/lib/db'
import { gradeReview } from '@/engine/spaced-repetition'

export async function getDueReviews(limit: number = 20) {
  return prisma.reviewItem.findMany({
    where: { nextReview: { lte: new Date() } },
    orderBy: { nextReview: 'asc' },
    take: limit,
  })
}

export async function getDueReviewCount() {
  return prisma.reviewItem.count({
    where: { nextReview: { lte: new Date() } },
  })
}

export async function submitReviewGrade(reviewItemId: string, grade: 0 | 1 | 2 | 3 | 4 | 5) {
  const item = await prisma.reviewItem.findUnique({
    where: { id: reviewItemId },
  })

  if (!item) throw new Error('Review item not found')

  // Increment reset count if the user failed (grade < 3 resets repetition)
  const newResetCount = grade < 3 ? item.resetCount + 1 : item.resetCount

  const result = gradeReview(
    { interval: item.interval, repetition: item.repetition, efactor: item.efactor },
    grade,
    newResetCount
  )

  return prisma.reviewItem.update({
    where: { id: reviewItemId },
    data: {
      interval: result.interval,
      repetition: result.repetition,
      efactor: result.efactor,
      nextReview: result.nextReview,
      lastReview: new Date(),
      resetCount: newResetCount,
    },
  })
}

export async function createReviewItem(data: {
  lessonId?: string
  skillId: string
  question: string
  answer: string
}) {
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + 1)

  return prisma.reviewItem.create({
    data: { ...data, nextReview },
  })
}

export async function getReviewStats() {
  const [total, due, agg] = await Promise.all([
    prisma.reviewItem.count(),
    getDueReviewCount(),
    prisma.reviewItem.aggregate({ _avg: { efactor: true } }),
  ])

  return {
    total,
    due,
    avgEfactor: Math.round((agg._avg.efactor || 2.5) * 100) / 100,
  }
}
