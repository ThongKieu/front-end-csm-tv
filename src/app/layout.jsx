'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from 'react-redux'
import store from '@/store/store'
import { SocketProvider } from '@/providers/SocketProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { ScheduleProvider } from '@/contexts/ScheduleContext'
import CreateScheduleButton from '@/components/layout/CreateScheduleButton'
import CreateScheduleModal from '@/components/layout/CreateScheduleModal'
import { useSchedule } from '@/contexts/ScheduleContext'

const inter = Inter({ subsets: ['latin'] })

function LayoutContent({ children }) {
  const { isCreateScheduleModalOpen, setIsCreateScheduleModalOpen, workers } = useSchedule()

  return (
    <html lang="vi">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthProvider>
            <SocketProvider>
              {children}
              <CreateScheduleButton />
              <CreateScheduleModal
                isOpen={isCreateScheduleModalOpen}
                onClose={() => setIsCreateScheduleModalOpen(false)}
                workers={workers}
              />
            </SocketProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
}

export default function RootLayout({ children }) {
  return (
    <ScheduleProvider>
      <LayoutContent>{children}</LayoutContent>
    </ScheduleProvider>
  )
} 