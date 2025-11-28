import { NextRequest, NextResponse } from 'next/server'
import { loadFromGist, saveToGist } from '@/lib/gist'

function getUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  try {
    const token = authHeader.replace('Bearer ', '')
    if (!token) return null
    const decoded = Buffer.from(token, 'base64').toString()
    const userData = JSON.parse(decoded)
    return userData?.id || null
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
    const data = await loadFromGist(userId)
    if (!data || !data.notes) {
      return NextResponse.json([])
    }
    const userNotes = data.notes[userId] || []
    return NextResponse.json(userNotes)
  } catch (error) {
    console.error('Failed to load notes:', error)
    return NextResponse.json({ message: 'Failed to load notes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
    }

    const { title, content, tags } = body
    
    let data
    try {
      data = await loadFromGist(userId)
    } catch (gistError) {
      console.error('Gist load error:', gistError)
      return NextResponse.json({ message: 'Failed to load data' }, { status: 500 })
    }

    if (!data || !data.notes) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 500 })
    }
    
    const note = {
      id: Date.now().toString(),
      title,
      content,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!data.notes[userId]) {
      data.notes[userId] = []
    }
    data.notes[userId].push(note)
    
    try {
      await saveToGist(data, userId)
    } catch (saveError) {
      console.error('Gist save error:', saveError)
      return NextResponse.json({ message: 'Failed to save data' }, { status: 500 })
    }

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Create note error:', error)
    return NextResponse.json({ message: 'Failed to create note' }, { status: 500 })
  }
}
