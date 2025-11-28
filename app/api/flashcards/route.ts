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
  const userFlashcards = data.flashcards?.[userId] || []
  return NextResponse.json(userFlashcards)
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, cards } = await request.json()
    const data = await loadFromGist(userId)

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
    await saveToGist(data, userId)

    return NextResponse.json(flashcard, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create flashcard' }, { status: 500 })
  }
}
