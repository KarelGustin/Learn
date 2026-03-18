import { prisma } from '@/lib/db'
import { gradeReview } from '@/engine/spaced-repetition'

export async function getDueReviews(limit: number = 20) {
  const now = new Date()
  const reviews = await prisma.reviewItem.findMany({
    where: {
      nextReview: { lte: now },
    },
    orderBy: { nextReview: 'asc' },
    take: limit,
  })
  return reviews
}

export async function getDueReviewCount() {
  return prisma.reviewItem.count({
    where: {
      nextReview: { lte: new Date() },
    },
  })
}

export async function submitReviewGrade(reviewItemId: string, grade: 0 | 1 | 2 | 3 | 4 | 5) {
  const item = await prisma.reviewItem.findUnique({
    where: { id: reviewItemId },
  })

  if (!item) throw new Error('Review item not found')

  // Count resets for leech detection
  const resetCount = item.repetition === 0 && item.lastReview ? 1 : 0

  const result = gradeReview(
    {
      interval: item.interval,
      repetition: item.repetition,
      efactor: item.efactor,
    },
    grade,
    resetCount
  )

  return prisma.reviewItem.update({
    where: { id: reviewItemId },
    data: {
      interval: result.interval,
      repetition: result.repetition,
      efactor: result.efactor,
      nextReview: result.nextReview,
      lastReview: new Date(),
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
    data: {
      ...data,
      nextReview,
    },
  })
}

export async function getReviewStats() {
  const total = await prisma.reviewItem.count()
  const due = await getDueReviewCount()
  const avgEfactor = await prisma.reviewItem.aggregate({
    _avg: { efactor: true },
  })

  return {
    total,
    due,
    avgEfactor: Math.round((avgEfactor._avg.efactor || 2.5) * 100) / 100,
  }
}
