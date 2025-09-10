import { NextResponse } from 'next/server'
import * as jose from 'jose'
import Cookies from 'js-cookie'

const JWT_SECRET = 'csm_tv_secret_key_2024'

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Không tìm thấy token' },
        { status: 401 }
      )
    }

    // Verify token
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)

    // Kiểm tra quyền truy cập dựa trên path
    const { pathname } = new URL(request.url)
    const isAdminRoute = pathname.startsWith('/admin')
    const isAccountantRoute = pathname.startsWith('/accountant')

    if (isAdminRoute && !['admin', 'manager', 'office'].includes(payload.role)) {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    if (isAccountantRoute && payload.role !== 'accountant') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    return NextResponse.json({ 
      user: {
        id: payload.userId,
        role: payload.role,
        email: payload.email
      }
    })
  } catch (error) {
    console.error('Token verification failed:', error)
    return NextResponse.json(
      { message: 'Token không hợp lệ' },
      { status: 401 }
    )
  }
} 