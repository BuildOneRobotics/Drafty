import { NextRequest, NextResponse } from 'next/server'
import { loadFromGist } from '@/lib/gist'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 })
    }
    
    let data
    try {
      data = await loadFromGist()
    } catch (gistError) {
      console.error('Gist load error:', gistError)
      return NextResponse.json({ message: 'Failed to load user data' }, { status: 500 })
    }

    if (!data || !data.users) {
      return NextResponse.json({ message: 'No users found' }, { status: 500 })
    }

    const user = data.users[email.toLowerCase()]
    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, email, name: user.name })).toString('base64')

    const response = NextResponse.json({
      token,
      user: { id: user.id, email, name: user.name },
    })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ message: error.message || 'Login failed' }, { status: 500 })
  }
}
