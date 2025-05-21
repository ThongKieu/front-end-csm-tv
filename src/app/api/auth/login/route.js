import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Data mẫu cho các tài khoản
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    name: 'Normal User',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Normal+User&background=0D8ABC&color=fff'
  },
  {
    id: 3,
    email: 'accountant@example.com',
    password: 'accountant123',
    name: 'Kế Toán',
    role: 'accountant',
    avatar: 'https://ui-avatars.com/api/?name=Accountant+User&background=0D8ABC&color=fff'
  }
]

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email và mật khẩu không được để trống' },
        { status: 400 }
      )
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // Create token
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' } 
    )

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
} 