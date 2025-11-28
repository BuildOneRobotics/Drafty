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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, cards } = await request.json()
    let data
    try {
      data = await loadFromGist(userId)
    } catch (gistError) {
      console.error('Gist load error:', gistError)
      return NextResponse.json({ message: 'Failed to load data' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 500 })
    }

    const flashcards = data.flashcards?.[userId] || []
    const flashcard = flashcards.find((f: any) => f.id === params.id)
    if (!flashcard) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    flashcard.title = title
    flashcard.cards = cards
    flashcard.updatedAt = new Date().toISOString()

    await saveToGist(data, userId)
    return NextResponse.json(flashcard)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update flashcard' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await loadFromGist(userId)
    data.flashcards = data.flashcards || {}
    data.flashcards[userId] = (data.flashcards[userId] || []).filter((f: any) => f.id !== params.id)
    await saveToGist(data, userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete flashcard' }, { status: 500 })
  }
}
