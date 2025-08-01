"use client";

import SidebarOnlyLayout from '@/components/layout/SidebarOnlyLayout'
import AuthGuard from '@/components/AuthGuard'

export default function AdminLayout({ children }) {
  return (
    <AuthGuard requiredRole={['admin', 'manager']}>
      <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
    </AuthGuard>
  )
} 