import { NextRequest, NextResponse } from 'next/server'
import { loadFromGist, saveToGist } from '@/lib/gist'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    const data = await loadFromGist(decoded.userId)
    return NextResponse.json(data.flashcards || [])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load flashcards' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    const { title, cards } = await req.json()

    const data = await loadFromGist(decoded.userId)
    const newFlashcard = {
      id: Date.now().toString(),
      title,
      cards: cards || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.flashcards = data.flashcards || []
    data.flashcards.push(newFlashcard)
    await saveToGist(data, decoded.userId)

    return NextResponse.json(newFlashcard)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create flashcard' }, { status: 500 })
  }
}
