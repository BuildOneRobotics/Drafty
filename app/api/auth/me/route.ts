import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    let userData
    try {
      userData = JSON.parse(Buffer.from(token, 'base64').toString())
    } catch (parseError) {
      console.error('Token parse error:', parseError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    if (!userData.id || !userData.email || !userData.name) {
      return NextResponse.json({ message: 'Invalid token data' }, { status: 401 })
    }

    const response = NextResponse.json({
      id: userData.id,
      email: userData.email,
      name: userData.name,
    })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
