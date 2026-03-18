import { NextResponse } from 'next/server'
import { submitReviewGrade, getDueReviews } from '@/services/review'

export async function GET() {
  try {
    const reviews = await getDueReviews()
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get reviews' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reviewItemId, grade } = body

    if (grade < 0 || grade > 5) {
      return NextResponse.json({ error: 'Grade must be 0-5' }, { status: 400 })
    }

    const updated = await submitReviewGrade(reviewItemId, grade)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error submitting review:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
