'use client'

import SidebarOnlyLayout from '@/components/layout/SidebarOnlyLayout'
import AuthGuard from '@/components/AuthGuard'

export default function AccountantLayout({ children }) {
  return (
    <AuthGuard requiredRole="accountant">
      <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
    </AuthGuard>
  )
} 