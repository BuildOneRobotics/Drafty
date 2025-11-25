import { NextRequest, NextResponse } from 'next/server'

const users: any = {}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (users[email]) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const userId = Date.now().toString()
    users[email] = {
      id: userId,
      email,
      password,
      name,
      buildoneId: null,
    }

    const token = Buffer.from(JSON.stringify({ id: userId, email })).toString('base64')

    return NextResponse.json({
      token,
      user: { id: userId, email, name, buildoneId: null },
    })
  } catch (error) {
    return NextResponse.json({ message: 'Signup failed' }, { status: 500 })
  }
}
