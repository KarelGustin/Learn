import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateStreak } from '@/services/analytics'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { lessonId, completed, score, timeSpentMs } = body

    const submission = await prisma.submission.create({
      data: {
        lessonId,
        completed: completed ?? true,
        score: score ?? 1.0,
        timeSpentMs: timeSpentMs ?? 0,
        completedAt: completed ? new Date() : null,
      },
    })

    // Update streak on lesson completion
    if (completed) {
      await updateStreak()
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error recording submission:', error)
    return NextResponse.json({ error: 'Failed to record submission' }, { status: 500 })
  }
}
