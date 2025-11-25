import { NextRequest, NextResponse } from 'next/server'

const users: any = {}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = users[email]
    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, email })).toString('base64')

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, buildoneId: user.buildoneId },
    })
  } catch (error) {
    return NextResponse.json({ message: 'Login failed' }, { status: 500 })
  }
}
