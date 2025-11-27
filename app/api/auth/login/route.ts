import { NextRequest, NextResponse } from 'next/server'
import { loadFromGist } from '@/lib/gist'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const data = await loadFromGist()

    if (!data.users) {
      return NextResponse.json({ message: 'No users found' }, { status: 500 })
    }

    const user = data.users[email]
    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, email, name: user.name })).toString('base64')

    const response = NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ message: error.message || 'Login failed' }, { status: 500 })
  }
}
