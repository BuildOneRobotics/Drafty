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

  try {
    const data = await loadFromGist()
    if (!data || !data.whiteboards) {
      return NextResponse.json([])
    }
    const userWhiteboards = data.whiteboards[userId] || []
    return NextResponse.json(userWhiteboards)
  } catch (error) {
    console.error('Failed to load whiteboards:', error)
    return NextResponse.json({ message: 'Failed to load whiteboards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, template } = await request.json()
    
    let data
    try {
      data = await loadFromGist()
    } catch (gistError) {
      console.error('Gist load error:', gistError)
      return NextResponse.json({ message: 'Failed to load data' }, { status: 500 })
    }

    if (!data) {
      data = { whiteboards: {} }
    }
    if (!data.whiteboards) {
      data.whiteboards = {}
    }
    
    const whiteboard = {
      id: Date.now().toString(),
      title,
      template,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!data.whiteboards[userId]) {
      data.whiteboards[userId] = []
    }
    data.whiteboards[userId].push(whiteboard)
    
    try {
      await saveToGist(data)
    } catch (saveError) {
      console.error('Gist save error:', saveError)
      return NextResponse.json({ message: 'Failed to save data' }, { status: 500 })
    }

    return NextResponse.json(whiteboard, { status: 201 })
  } catch (error) {
    console.error('Create whiteboard error:', error)
    return NextResponse.json({ message: 'Failed to create whiteboard' }, { status: 500 })
  }
}
