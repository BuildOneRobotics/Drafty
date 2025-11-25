import { NextRequest, NextResponse } from 'next/server'

const notesDB: any = {}

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
    const { title, content, tags } = await request.json()
    const userNotes = notesDB[userId] || []
    const noteIndex = userNotes.findIndex((n: any) => n.id === params.id)

    if (noteIndex === -1) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 })
    }

    userNotes[noteIndex] = {
      ...userNotes[noteIndex],
      title,
      content,
      tags,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(userNotes[noteIndex])
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userNotes = notesDB[userId] || []
    const noteIndex = userNotes.findIndex((n: any) => n.id === params.id)

    if (noteIndex === -1) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 })
    }

    userNotes.splice(noteIndex, 1)
    return NextResponse.json({ message: 'Note deleted' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete note' }, { status: 500 })
  }
}
