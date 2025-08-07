'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { ROUTES, getRoleBasedRoute } from '@/config/routes'
import LoginClient from "./LoginClient";
import AuthLoading from '@/components/AuthLoading'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    console.log('LoginPage: useEffect triggered', { 
      isLoading, 
      isAuthenticated, 
      user: user?.role,
      userData: user 
    })
    
    // Chỉ redirect khi đã hoàn tất quá trình loading và đã đăng nhập
    if (!isLoading && isAuthenticated && user) {
      const roleBasedRoute = getRoleBasedRoute(user.role)
      console.log('LoginPage: Redirecting to role-based route:', roleBasedRoute)
      router.push(roleBasedRoute)
    }
  }, [isAuthenticated, isLoading, user, router])

  // Hiển thị loading khi đang khôi phục authentication
  if (isLoading) {
    return <AuthLoading />
  }

  // Nếu đã đăng nhập, không hiển thị gì (sẽ redirect)
  if (isAuthenticated && user) {
    return null
  }

  return (
    <div className="flex w-full min-h-screen">
      <LoginClient />
    </div>
  );
}
