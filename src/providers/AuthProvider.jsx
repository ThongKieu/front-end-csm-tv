'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { restoreAuth, setLoading, clearAuth } from '@/store/slices/authSlice'
import { restoreAuthState, setupAuthListener } from '@/utils/auth'

export function AuthProvider({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    // Khôi phục trạng thái authentication khi component mount
    const authState = restoreAuthState()
    
    if (authState) {
      dispatch(restoreAuth(authState))
    } else {
      dispatch(setLoading(false))
    }

    // Lắng nghe thay đổi localStorage giữa các tab
    const cleanup = setupAuthListener(() => {
      const newAuthState = restoreAuthState()
      if (newAuthState) {
        dispatch(restoreAuth(newAuthState))
      } else {
        dispatch(clearAuth())
      }
    })

    // Cleanup khi component unmount
    return cleanup
  }, [dispatch])

  return children
} 