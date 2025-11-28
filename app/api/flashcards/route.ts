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
    if (!data || !data.flashcards) {
      return NextResponse.json([])
    }
    const userFlashcards = data.flashcards[userId] || []
    return NextResponse.json(userFlashcards)
  } catch (error) {
    console.error('Failed to load flashcards:', error)
    return NextResponse.json({ message: 'Failed to load flashcards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, cards } = await request.json()
    
    if (!title) {
      return NextResponse.json({ message: 'Title required' }, { status: 400 })
    }

    let data
    try {
      data = await loadFromGist()
    } catch (loadError) {
      console.error('Failed to load gist:', loadError)
      return NextResponse.json({ message: 'Failed to load data' }, { status: 500 })
    }

    if (!data) {
      data = { flashcards: {} }
    }

    const flashcard = {
      id: Date.now().toString(),
      title,
      cards: cards || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!data.flashcards) {
      data.flashcards = {}
    }
    if (!data.flashcards[userId]) {
      data.flashcards[userId] = []
    }
    data.flashcards[userId].push(flashcard)
    
    try {
      await saveToGist(data)
    } catch (saveError) {
      console.error('Failed to save gist:', saveError)
      return NextResponse.json({ message: 'Failed to save flashcard' }, { status: 500 })
    }

    return NextResponse.json(flashcard, { status: 201 })
  } catch (error) {
    console.error('Create flashcard error:', error)
    return NextResponse.json({ message: 'Failed to create flashcard' }, { status: 500 })
  }
}
