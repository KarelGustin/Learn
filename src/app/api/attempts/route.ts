import { NextResponse } from 'next/server'
import { recordAttemptAndUpdateMastery } from '@/services/mastery'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { exerciseId, answer, correct, timeSpentMs, hints, confidence } = body

    const attempt = await recordAttemptAndUpdateMastery(
      exerciseId,
      typeof answer === 'string' ? answer : JSON.stringify(answer),
      correct,
      timeSpentMs || 0,
      hints || 0,
      confidence || 3
    )

    return NextResponse.json(attempt)
  } catch (error) {
    console.error('Error recording attempt:', error)
    return NextResponse.json({ error: 'Failed to record attempt' }, { status: 500 })
  }
}
