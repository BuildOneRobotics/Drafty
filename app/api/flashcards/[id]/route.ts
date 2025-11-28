import { NextRequest, NextResponse } from 'next/server'
import { loadFromGist, saveToGist } from '@/lib/gist'
import jwt from 'jsonwebtoken'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    const { title, cards } = await req.json()

    const data = await loadFromGist(decoded.userId)
    const flashcard = data.flashcards?.find((f: any) => f.id === params.id)
    if (!flashcard) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    flashcard.title = title
    flashcard.cards = cards
    flashcard.updatedAt = new Date().toISOString()

    await saveToGist(data, decoded.userId)
    return NextResponse.json(flashcard)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update flashcard' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    const data = await loadFromGist(decoded.userId)

    data.flashcards = data.flashcards?.filter((f: any) => f.id !== params.id) || []
    await saveToGist(data, decoded.userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete flashcard' }, { status: 500 })
  }
}
