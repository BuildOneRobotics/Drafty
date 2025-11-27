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

  const data = await loadFromGist()
  const userNotes = data.notes[userId] || []
  return NextResponse.json(userNotes)
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, content, tags } = await request.json()
    const data = await loadFromGist()
    
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
    await saveToGist(data)

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create note' }, { status: 500 })
  }
}
