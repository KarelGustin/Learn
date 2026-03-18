import { NextResponse } from 'next/server'
import { getUserSettings, updateUserSettings } from '@/services/journal'
import { settingsSchema } from '@/lib/validations'

export async function GET() {
  try {
    const settings = await getUserSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('GET /api/settings failed:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const raw = await request.json()
    const parsed = settingsSchema.safeParse(raw)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const settings = await updateUserSettings(parsed.data)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('POST /api/settings failed:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
