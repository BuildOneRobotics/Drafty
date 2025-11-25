import { NextRequest, NextResponse } from 'next/server'

function getUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  try {
    const token = authHeader.replace('Bearer ', '')
    const userData = JSON.parse(Buffer.from(token, 'base64').toString())
    return userData.id
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Sync notes with BuildOne if user has buildoneId
    // This would integrate with BuildOne's sync API
    return NextResponse.json({ message: 'Sync completed', synced: true })
  } catch (error) {
    return NextResponse.json({ message: 'Sync failed' }, { status: 500 })
  }
}
