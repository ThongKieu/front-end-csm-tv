'use client'

import { useState, useEffect } from 'react'
import { useSchedule } from '@/contexts/ScheduleContext'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Sử dụng CreateScheduleModal từ context
  const { setIsCreateScheduleModalOpen } = useSchedule()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch users
        const usersResponse = await fetch('/api/admin/users')
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users')
        }
        const usersData = await usersResponse.json()
        setUsers(usersData)

        // Fetch workers
        const fetchWorkers = async () => {
          try {
            const response = await fetch('https://csm.thoviet.net/api/web/workers')
            if (!response.ok) {
              throw new Error('Failed to fetch workers')
            }
            const workersData = await response.json()
            setWorkers(workersData)
          } catch (error) {
            console.error('Error fetching workers:', error)
            setError('Không thể tải danh sách thợ')
          }
        }
        
        await fetchWorkers()
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Không thể tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <button
          onClick={() => setIsCreateScheduleModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tạo lịch làm việc
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Danh sách thợ */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Danh sách thợ</h2>
              <div className="space-y-2">
                {workers.map((worker) => (
                  <div
                    key={worker.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{worker.name}</h3>
                        <p className="text-sm text-gray-600">{worker.phone}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        worker.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {worker.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danh sách người dùng */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Danh sách người dùng</h2>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 