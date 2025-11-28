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
    const { title, content } = await request.json()
    const data = await loadFromGist()
    
    if (!data.whiteboards?.[userId]) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    const index = data.whiteboards[userId].findIndex((w: any) => w.id === params.id)
    if (index === -1) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    data.whiteboards[userId][index] = {
      ...data.whiteboards[userId][index],
      title: title || data.whiteboards[userId][index].title,
      content: content || data.whiteboards[userId][index].content,
      updatedAt: new Date().toISOString(),
    }

    await saveToGist(data)
    return NextResponse.json(data.whiteboards[userId][index])
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update whiteboard' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await loadFromGist()
    
    if (!data.whiteboards?.[userId]) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    data.whiteboards[userId] = data.whiteboards[userId].filter((w: any) => w.id !== params.id)
    await saveToGist(data)

    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete whiteboard' }, { status: 500 })
  }
}
