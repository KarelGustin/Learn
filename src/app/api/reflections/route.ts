import { NextResponse } from 'next/server'
import { createReflection, getReflections } from '@/services/journal'
import { reflectionSchema } from '@/lib/validations'

export async function GET() {
  try {
    const reflections = await getReflections()
    return NextResponse.json(reflections)
  } catch (error) {
    console.error('GET /api/reflections failed:', error)
    return NextResponse.json({ error: 'Failed to fetch reflections' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const raw = await request.json()
    const parsed = reflectionSchema.safeParse(raw)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const entry = await createReflection(parsed.data)
    return NextResponse.json(entry)
  } catch (error) {
    console.error('POST /api/reflections failed:', error)
    return NextResponse.json({ error: 'Failed to create reflection' }, { status: 500 })
  }
}
