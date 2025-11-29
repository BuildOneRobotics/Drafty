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
    if (!data || !data.notebooks) {
      return NextResponse.json({ data: [] })
    }
    const userNotebooks = data.notebooks[userId] || []
    return NextResponse.json({ data: userNotebooks })
  } catch (error) {
    console.error('Failed to load notebooks:', error)
    return NextResponse.json({ message: 'Failed to load notebooks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, folder } = await request.json()
    
    let data
    try {
      data = await loadFromGist()
    } catch (gistError) {
      console.error('Gist load error:', gistError)
      return NextResponse.json({ message: 'Failed to load data' }, { status: 500 })
    }

    if (!data) {
      data = { notebooks: {} }
    }
    if (!data.notebooks) {
      data.notebooks = {}
    }
    
    const notebook = {
      id: Date.now().toString(),
      name,
      folder: folder || '',
      pages: [{
        id: '1',
        number: 1,
        title: 'Page 1',
        content: ''
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!data.notebooks[userId]) {
      data.notebooks[userId] = []
    }
    data.notebooks[userId].push(notebook)
    
    try {
      await saveToGist(data)
    } catch (saveError) {
      console.error('Gist save error:', saveError)
      return NextResponse.json({ message: 'Failed to save data' }, { status: 500 })
    }

    return NextResponse.json({ data: notebook }, { status: 201 })
  } catch (error) {
    console.error('Create notebook error:', error)
    return NextResponse.json({ message: 'Failed to create notebook' }, { status: 500 })
  }
}