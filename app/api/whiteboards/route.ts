import { NextRequest, NextResponse } from 'next/server'
import { loadFromGist, saveToGist } from '@/lib/gist'

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

export async function GET(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const data = await loadFromGist(userId)
  const userWhiteboards = data.whiteboards?.[userId] || []
  return NextResponse.json(userWhiteboards)
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, template } = await request.json()
    const data = await loadFromGist(userId)
    
    const whiteboard = {
      id: Date.now().toString(),
      title,
      template,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!data.whiteboards) data.whiteboards = {}
    if (!data.whiteboards[userId]) {
      data.whiteboards[userId] = []
    }
    data.whiteboards[userId].push(whiteboard)
    await saveToGist(data, userId)

    return NextResponse.json(whiteboard, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create whiteboard' }, { status: 500 })
  }
}
