'use client'

import { Provider } from 'react-redux'
import store from '@/store/store'
import './globals.css'

export default function RootLayout({ children }) {
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