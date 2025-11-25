import { NextRequest, NextResponse } from 'next/server'

const users: any = {}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    // Exchange code with BuildOne for access token
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BUILDONE_API_URL}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.NEXT_PUBLIC_BUILDONE_CLIENT_ID,
        client_secret: process.env.BUILDONE_CLIENT_SECRET,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user info from BuildOne
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BUILDONE_API_URL}/api/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    const buildoneUser = await userResponse.json()
    const email = buildoneUser.email

    if (!users[email]) {
      users[email] = {
        id: Date.now().toString(),
        email,
        name: buildoneUser.name,
        buildoneId: buildoneUser.id,
        password: null,
      }
    } else {
      users[email].buildoneId = buildoneUser.id
    }

    const user = users[email]
    const token = Buffer.from(JSON.stringify({ id: user.id, email })).toString('base64')

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, buildoneId: user.buildoneId },
    })
  } catch (error) {
    return NextResponse.json({ message: 'BuildOne auth failed' }, { status: 500 })
  }
}
