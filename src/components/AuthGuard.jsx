'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/config/routes'
import AuthLoading from './AuthLoading'

export default function AuthGuard({ children, requiredRole = null }) {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    console.log('AuthGuard: useEffect triggered', { 
      isLoading, 
      isAuthenticated, 
      user: user?.role,
      requiredRole 
    })
    
    // Chỉ kiểm tra khi đã hoàn tất quá trình loading authentication
    if (!isLoading) {
      console.log('AuthGuard: Loading hoàn tất, kiểm tra authentication')
      
      if (!isAuthenticated) {
        console.log('AuthGuard: Không authenticated, redirect to login')
        // Thêm delay nhỏ để tránh redirect quá nhanh
        setTimeout(() => {
          router.push(ROUTES.LOGIN)
        }, 200) // Tăng delay lên 200ms
        return
      }

      // Kiểm tra role nếu có yêu cầu
      if (requiredRole) {
        const hasRequiredRole = Array.isArray(requiredRole) 
          ? requiredRole.includes(user?.role)
          : user?.role === requiredRole
        
        if (!hasRequiredRole) {
          console.log('AuthGuard: Không đủ quyền, redirect to dashboard')
          router.push('/dashboard')
          return
        }
      }

      console.log('AuthGuard: Authentication và quyền hợp lệ')
      setIsChecking(false)
    } else {
      console.log('AuthGuard: Vẫn đang loading, chờ...')
    }
  }, [isAuthenticated, isLoading, router, user?.role, requiredRole])

  // Hiển thị loading khi đang khôi phục authentication
  if (isLoading || isChecking) {
    return <AuthLoading />
  }

  // Không hiển thị gì nếu chưa đăng nhập hoặc không đủ quyền
  if (!isAuthenticated) {
    return null
  }

  return children
} 