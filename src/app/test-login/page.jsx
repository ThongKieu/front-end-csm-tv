'use client'

import { useState } from 'react'

export default function TestLogin() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin123'
        }),
      })
      
      const data = await response.json()
      
      setResult(JSON.stringify({
        status: response.status,
        ok: response.ok,
        data: data
      }, null, 2))
    } catch (error) {
      setResult('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Login API</h1>
      <button 
        onClick={testLogin}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Login'}
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
        {result}
      </pre>
    </div>
  )
} 