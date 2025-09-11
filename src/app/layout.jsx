'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from 'react-redux'
import store from '@/store/store'
import { AuthProvider } from '@/providers/AuthProvider'
import { ScheduleProvider } from '@/contexts/ScheduleContext'
import CreateScheduleButton from '@/components/layout/CreateScheduleButton'
import CreateScheduleModal from '@/components/layout/CreateScheduleModal'
import { useSchedule } from '@/contexts/ScheduleContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { LoadingProvider } from '@/contexts/LoadingContext'
import { ToastContainer } from '@/components/ui/toast'
import LoadingOverlay from '@/components/ui/LoadingOverlay'
import PageTransition from '@/components/ui/PageTransition'
import { useSelector } from 'react-redux'
import { selectAuthLoading } from '@/store/slices/authSlice'
import AuthLoading from '@/components/AuthLoading'

const inter = Inter({ subsets: ['latin'] })

function AppContent({ children }) {
  const { 
    isCreateScheduleModalOpen, 
    setIsCreateScheduleModalOpen, 
    workers, 
    refreshData,
    notifyJobCreated 
  } = useSchedule()
  const isLoading = useSelector(selectAuthLoading)
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated)
  
  // Lấy selectedDate từ Redux store nếu có
  const selectedDate = useSelector(state => state.work?.selectedDate)

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return <AuthLoading />
  }

  return (
    <>
      <PageTransition>
        {children}
      </PageTransition>
      {/* Chỉ hiển thị nút tạo công việc và modal khi đã đăng nhập */}
      {isAuthenticated && (
        <>
          <CreateScheduleButton />
          <CreateScheduleModal
            isOpen={isCreateScheduleModalOpen}
            onClose={() => setIsCreateScheduleModalOpen(false)}
            workers={workers}
            onSuccess={async (targetDate, forceRefresh = false) => {
              // Chỉ gọi refreshData từ ScheduleContext, không gọi notifyJobCreated để tránh duplicate API calls
              await refreshData(targetDate, forceRefresh);
            }}
            selectedDate={selectedDate}
          />
        </>
      )}
      <LoadingOverlay />
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
            <SettingsProvider>
              <ToastProvider>
                <LoadingProvider>
                  <ScheduleProvider>
                    <AppContent>{children}</AppContent>
                  </ScheduleProvider>
                </LoadingProvider>
              </ToastProvider>
            </SettingsProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
} 