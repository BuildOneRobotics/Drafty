import { NextRequest, NextResponse } from 'next/server'
import { loadFromGist, saveToGist } from '@/lib/gist'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    const data = await loadFromGist()

    if (data.users[email]) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const userId = Date.now().toString()
    data.users[email] = { id: userId, email, password, name }
    await saveToGist(data)

    const token = Buffer.from(JSON.stringify({ id: userId, email, name })).toString('base64')

    const response = NextResponse.json({
      token,
      user: { id: userId, email, name },
    })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  } catch (error) {
    return NextResponse.json({ message: 'Signup failed' }, { status: 500 })
  }
}
