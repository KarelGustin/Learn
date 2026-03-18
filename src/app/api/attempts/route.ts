import { NextResponse } from 'next/server'
import { recordAttemptAndUpdateMastery } from '@/services/mastery'
import { attemptSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const raw = await request.json()
    const parsed = attemptSchema.safeParse(raw)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { exerciseId, answer, correct, timeSpentMs, hints, confidence } = parsed.data

    const attempt = await recordAttemptAndUpdateMastery(
      exerciseId, answer, correct, timeSpentMs, hints, confidence
    )

    return NextResponse.json(attempt)
  } catch (error) {
    console.error('POST /api/attempts failed:', error)
    return NextResponse.json({ error: 'Failed to record attempt' }, { status: 500 })
  }
}
