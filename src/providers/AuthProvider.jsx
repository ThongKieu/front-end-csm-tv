'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { restoreAuth, setLoading, clearAuth } from '@/store/slices/authSlice'
import { restoreAuthState, setupAuthListener } from '@/utils/auth'

export function AuthProvider({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('AuthProvider: Bắt đầu khôi phục trạng thái authentication...')
    
    // Sử dụng setTimeout để đảm bảo localStorage đã sẵn sàng
    const timer = setTimeout(() => {
      // Khôi phục trạng thái authentication khi component mount
      const authState = restoreAuthState()
      console.log('AuthProvider: authState từ localStorage:', authState)
      
      if (authState) {
        console.log('AuthProvider: Khôi phục authentication thành công')
        dispatch(restoreAuth(authState))
      } else {
        console.log('AuthProvider: Không có auth state, set loading = false')
        // Nếu không có auth state, vẫn set loading = false để cho phép truy cập trang login
        dispatch(setLoading(false))
      }
    }, 200) // Delay 200ms để đảm bảo localStorage đã sẵn sàng

    // Lắng nghe thay đổi localStorage giữa các tab
    const cleanup = setupAuthListener(() => {
      console.log('AuthProvider: localStorage thay đổi, kiểm tra lại auth state')
      const newAuthState = restoreAuthState()
      if (newAuthState) {
        dispatch(restoreAuth(newAuthState))
      } else {
        dispatch(clearAuth())
      }
    })

    // Cleanup khi component unmount
    return () => {
      clearTimeout(timer)
      cleanup()
    }
  }, [dispatch])

  return children
} 