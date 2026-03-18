import { NextResponse } from 'next/server'
import { createReflection, getReflections } from '@/services/journal'

export async function GET() {
  try {
    const reflections = await getReflections()
    return NextResponse.json(reflections)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get reflections' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const entry = await createReflection(body)
    return NextResponse.json(entry)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reflection' }, { status: 500 })
  }
}
