'use client'

import Sidebar from './Sidebar'

export default function SidebarOnlyLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 