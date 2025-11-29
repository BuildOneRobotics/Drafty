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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const updates = await request.json()
    const data = await loadFromGist()
    
    if (!data || !data.notebooks || !data.notebooks[userId]) {
      return NextResponse.json({ message: 'Notebook not found' }, { status: 404 })
    }

    const notebookIndex = data.notebooks[userId].findIndex((nb: any) => nb.id === params.id)
    if (notebookIndex === -1) {
      return NextResponse.json({ message: 'Notebook not found' }, { status: 404 })
    }

    data.notebooks[userId][notebookIndex] = {
      ...data.notebooks[userId][notebookIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await saveToGist(data)
    return NextResponse.json({ data: data.notebooks[userId][notebookIndex] })
  } catch (error) {
    console.error('Update notebook error:', error)
    return NextResponse.json({ message: 'Failed to update notebook' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await loadFromGist()
    
    if (!data || !data.notebooks || !data.notebooks[userId]) {
      return NextResponse.json({ message: 'Notebook not found' }, { status: 404 })
    }

    data.notebooks[userId] = data.notebooks[userId].filter((nb: any) => nb.id !== params.id)
    await saveToGist(data)
    
    return NextResponse.json({ message: 'Notebook deleted' })
  } catch (error) {
    console.error('Delete notebook error:', error)
    return NextResponse.json({ message: 'Failed to delete notebook' }, { status: 500 })
  }
}