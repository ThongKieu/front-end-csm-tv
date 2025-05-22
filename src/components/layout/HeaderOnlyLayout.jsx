'use client'

import Header from './Header'

export default function HeaderOnlyLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
} 