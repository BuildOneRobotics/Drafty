import { loadFromGist, saveToGist } from '@/lib/gist'

function decodeBase64(input: string) {
  try {
    // Prefer Buffer when available (Node). Use globalThis to avoid TS 'Buffer' name errors.
    const g: any = globalThis as any
    if (g?.Buffer?.from) {
      return g.Buffer.from(input, 'base64').toString()
    }
    if (typeof atob !== 'undefined') {
      return atob(input)
    }
  } catch (e) {
    // fall through
  }
  return ''
}

function getUserId(request: any): string | null {
  const authHeader = request?.headers?.get?.('authorization')
  if (!authHeader) return null
  try {
    const token = authHeader.replace('Bearer ', '')
    const decoded = decodeBase64(token)
    const userData = JSON.parse(decoded || '{}')
    return userData.id || null
  } catch {
    return null
  }
}

export async function GET(request: any) {
  const userId = getUserId(request)
  if (!userId) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } })
  }

  try {
    const data = await loadFromGist()
    if (!data || !data.notebooks) {
      return new Response(JSON.stringify({ data: [] }), { headers: { 'content-type': 'application/json' } })
    }
    const userNotebooks = data.notebooks[userId] || []
    return new Response(JSON.stringify({ data: userNotebooks }), { headers: { 'content-type': 'application/json' } })
  } catch (error) {
    console.error('Failed to load notebooks:', error)
    return new Response(JSON.stringify({ message: 'Failed to load notebooks' }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}

export async function POST(request: any) {
  const userId = getUserId(request)
  if (!userId) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } })
  }

  try {
    const { name, folder } = await request.json()
    
    let data
    try {
      data = await loadFromGist()
    } catch (gistError) {
      console.error('Gist load error:', gistError)
      return new Response(JSON.stringify({ message: 'Failed to load data' }), { status: 500, headers: { 'content-type': 'application/json' } })
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
      return new Response(JSON.stringify({ message: 'Failed to save data' }), { status: 500, headers: { 'content-type': 'application/json' } })
    }

    return new Response(JSON.stringify({ data: notebook }), { status: 201, headers: { 'content-type': 'application/json' } })
  } catch (error) {
    console.error('Create notebook error:', error)
    return new Response(JSON.stringify({ message: 'Failed to create notebook' }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}