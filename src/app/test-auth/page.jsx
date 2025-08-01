'use client'

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TestAuthPage() {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    console.log('TestAuth: Auth state changed', { isAuthenticated, user, isLoading })
  }, [isAuthenticated, user, isLoading])

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const handleGoToLogin = () => {
    router.push('/login')
  }

  const handleClearAuth = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Test Auth State</h1>
        
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded">
            <h2 className="font-semibold mb-2">Auth State:</h2>
            <p><strong>isLoading:</strong> {isLoading ? 'true' : 'false'}</p>
            <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
            <p><strong>User Role:</strong> {user?.role || 'null'}</p>
            <p><strong>User ID:</strong> {user?.id || 'null'}</p>
            <p><strong>User Name:</strong> {user?.user_name || 'null'}</p>
          </div>

          <div className="p-3 bg-green-50 rounded">
            <h2 className="font-semibold mb-2">localStorage:</h2>
            <p><strong>auth_token:</strong> {localStorage.getItem('auth_token') ? 'Có' : 'Không'}</p>
            <p><strong>auth_user:</strong> {localStorage.getItem('auth_user') ? 'Có' : 'Không'}</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleGoToDashboard}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleGoToLogin}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Login
            </button>
          </div>

          <button
            onClick={handleClearAuth}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Auth Data
          </button>
        </div>
      </div>
    </div>
  )
} 