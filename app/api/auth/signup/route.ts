import { NextRequest, NextResponse } from 'next/server'
import { loadFromGist, saveToGist } from '@/lib/gist'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Email, password, and name required' }, { status: 400 })
    }
    
    let data
    try {
      data = await loadFromGist()
    } catch (gistError) {
      console.error('Gist load error:', gistError)
      return NextResponse.json({ message: 'Failed to load user data' }, { status: 500 })
    }

    if (!data) {
      data = { users: {} }
    }

    if (!data || !data.users) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 500 })
    }

    const emailLower = email.toLowerCase()

    if (data.users[emailLower]) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const userId = Date.now().toString()
    data.users[emailLower] = { id: userId, email: emailLower, password, name }
    try {
      await saveToGist(data)
    } catch (saveError) {
      console.error('Gist save error:', saveError)
      return NextResponse.json({ message: 'Failed to save user data' }, { status: 500 })
    }

    let token
    try {
      token = Buffer.from(JSON.stringify({ id: userId, email: emailLower, name })).toString('base64')
    } catch (tokenError) {
      console.error('Token generation error:', tokenError)
      return NextResponse.json({ message: 'Failed to generate token' }, { status: 500 })
    }

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
