'use client'

import { Provider } from 'react-redux'
import store from '@/store/store'
import { SocketProvider } from '@/providers/SocketProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Provider store={store}>
          <AuthProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
} 