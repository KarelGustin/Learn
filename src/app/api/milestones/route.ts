import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { milestoneSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const raw = await request.json()
    const parsed = milestoneSchema.safeParse(raw)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { milestoneId, completed } = parsed.data

    const milestone = await prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    return NextResponse.json(milestone)
  } catch (error) {
    console.error('POST /api/milestones failed:', error)
    return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 })
  }
}
