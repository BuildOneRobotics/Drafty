import { NextRequest, NextResponse } from 'next/server'
import { loadFromGist, saveToGist } from '@/lib/gist'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Email, password, and name required' }, { status: 400 })
    }
    
    const data = await loadFromGist()
    const emailLower = email.toLowerCase()

    if (data.users[emailLower]) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const userId = Date.now().toString()
    data.users[emailLower] = { id: userId, email: emailLower, password, name }
    await saveToGist(data)

    const token = Buffer.from(JSON.stringify({ id: userId, email: emailLower, name })).toString('base64')

    const response = NextResponse.json({
      token,
      user: { id: userId, email: emailLower, name },
    })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  } catch (error) {
    return NextResponse.json({ message: 'Signup failed' }, { status: 500 })
  }
}
