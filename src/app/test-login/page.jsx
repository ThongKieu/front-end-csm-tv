'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@/store/slices/authSlice'

export default function TestLoginPage() {
  const [formData, setFormData] = useState({
    user_name: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  
  const dispatch = useDispatch()
  const { isAuthenticated, user, isLoading: authLoading } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setResult('')

    try {
      console.log('TestLogin: Bắt đầu đăng nhập...')
      
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('TestLogin: Response từ API:', data)
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại')
      }
      
      setResult('Đăng nhập thành công! Response: ' + JSON.stringify(data, null, 2))
      
      // Dispatch login action
      if (data.token && data.user) {
        console.log('TestLogin: Dispatching login...')
        dispatch(login(data))
      }
      
    } catch (error) {
      console.error('TestLogin: Lỗi:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Test Login</h1>
        
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p className="text-sm">
            <strong>Auth State:</strong><br/>
            isAuthenticated: {authLoading ? 'Loading...' : isAuthenticated ? 'true' : 'false'}<br/>
            user: {user ? JSON.stringify(user) : 'null'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={formData.user_name}
              onChange={(e) => setFormData({...formData, user_name: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600 whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </div>
  )
} 