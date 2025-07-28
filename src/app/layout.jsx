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
import { SettingsProvider } from '@/contexts/SettingsContext'
import { ToastContainer } from '@/components/ui/toast'
import { useSelector } from 'react-redux'
import { selectAuthLoading } from '@/store/slices/authSlice'
import AuthLoading from '@/components/AuthLoading'

const inter = Inter({ subsets: ['latin'] })

function AppContent({ children }) {
  const { isCreateScheduleModalOpen, setIsCreateScheduleModalOpen, workers, refreshData } = useSchedule()
  const isLoading = useSelector(selectAuthLoading)

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return <AuthLoading />
  }

  return (
    <>
      {children}
      <CreateScheduleButton />
      <CreateScheduleModal
        isOpen={isCreateScheduleModalOpen}
        onClose={() => setIsCreateScheduleModalOpen(false)}
        workers={workers}
        onSuccess={refreshData}
      />
      <ToastContainer />
    </>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthProvider>
            <SocketProvider>
              <SettingsProvider>
                <ScheduleProvider>
                  <AppContent>{children}</AppContent>
                </ScheduleProvider>
              </SettingsProvider>
            </SocketProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
}

// export const metadata = {
//   title: 'CSM TV',
//   description: 'Customer Service Management System',
// } 