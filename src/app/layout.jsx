'use client'

import { Provider } from 'react-redux'
import { useEffect } from 'react'
import store from '@/store/store'
import { verifyToken } from '@/store/slices/authSlice'
import './globals.css'

export default function RootLayout({ children }) {
  useEffect(() => {
    // Khôi phục trạng thái authentication khi component mount
    store.dispatch(verifyToken())
  }, [])

  return (
    <html lang="vi">
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  )
} 