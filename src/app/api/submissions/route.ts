import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateStreak } from '@/services/analytics'
import { submissionSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const raw = await request.json()
    const parsed = submissionSchema.safeParse(raw)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { lessonId, completed, score, timeSpentMs } = parsed.data

    const submission = await prisma.submission.create({
      data: {
        lessonId,
        completed,
        score,
        timeSpentMs,
        completedAt: completed ? new Date() : null,
      },
    })

    if (completed) {
      await updateStreak()
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error('POST /api/submissions failed:', error)
    return NextResponse.json({ error: 'Failed to record submission' }, { status: 500 })
  }
}
