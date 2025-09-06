'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { restoreAuth, setLoading, clearAuth } from '@/store/slices/authSlice'
import { setupAuthListener } from '@/utils/auth'

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const hasInitialized = useRef(false)
  const dispatchRef = useRef(dispatch)

  // Cập nhật dispatch ref khi dispatch thay đổi
  useEffect(() => {
    dispatchRef.current = dispatch
  }, [dispatch])

  // Khôi phục trạng thái authentication CHỈ 1 LẦN khi mount
  const handleRestoreAuth = useCallback(() => {
    try {
      // Lấy token và user từ storage
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
      const userStr = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')
      
      if (token && userStr) {
        const user = JSON.parse(userStr)
        // Dispatch restoreAuth action
        dispatchRef.current(restoreAuth({ token, user }))
        dispatchRef.current(setLoading(false))
      } else {
        dispatchRef.current(setLoading(false))
      }
    } catch (error) {
      dispatchRef.current(setLoading(false))
    }
  }, []) // Bỏ dispatch dependency để tránh re-create function

  useEffect(() => {
    // Chỉ chạy 1 lần khi mount
    if (hasInitialized.current) {
      return
    }
    
    hasInitialized.current = true
    
    // Restore auth state CHỈ 1 LẦN
    handleRestoreAuth()

    // Lắng nghe thay đổi localStorage giữa các tab (không gọi restoreAuth)
    const cleanup = setupAuthListener(() => {
      // KHÔNG gọi restoreAuth() ở đây để tránh vòng lặp
    })

    // Cleanup khi component unmount
    return cleanup
  }, []) // Bỏ tất cả dependencies để chỉ chạy 1 lần

  return children
} 