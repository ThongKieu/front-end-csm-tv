import { NextResponse } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = 'csm_tv_secret_key_2024'

export async function POST(request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Token không được cung cấp' },
        { status: 400 }
      )
    }

    // Verify token
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)

    return NextResponse.json({ payload })
  } catch (error) {
    console.error('Token verification failed:', error)
    return NextResponse.json(
      { message: 'Token không hợp lệ' },
      { status: 401 }
    )
  }
} 