import { NextResponse } from 'next/server'
import { submitReviewGrade, getDueReviews } from '@/services/review'
import { reviewGradeSchema } from '@/lib/validations'

export async function GET() {
  try {
    const reviews = await getDueReviews()
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('GET /api/review failed:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const raw = await request.json()
    const parsed = reviewGradeSchema.safeParse(raw)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const updated = await submitReviewGrade(
      parsed.data.reviewItemId,
      parsed.data.grade as 0 | 1 | 2 | 3 | 4 | 5
    )
    return NextResponse.json(updated)
  } catch (error) {
    console.error('POST /api/review failed:', error)
    return NextResponse.json({ error: 'Failed to submit review grade' }, { status: 500 })
  }
}
