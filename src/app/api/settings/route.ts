import { NextResponse } from 'next/server'
import { updateUserSettings } from '@/services/journal'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const settings = await updateUserSettings(body)
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
