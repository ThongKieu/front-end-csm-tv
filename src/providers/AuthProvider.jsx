'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '@/store/slices/authSlice'
import Cookies from 'js-cookie'

export function AuthProvider({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      try {
        // Giải mã token để lấy thông tin user
        const payload = JSON.parse(atob(token.split('.')[1]))
        const user = {
          id: payload.userId,
          email: payload.email,
          role: payload.role
        }
        
        // Khôi phục trạng thái đăng nhập
        dispatch(login({ user, token }))
      } catch (error) {
        console.error('Error restoring auth state:', error)
        Cookies.remove('token')
      }
    }
  }, [dispatch])

  return children
} 