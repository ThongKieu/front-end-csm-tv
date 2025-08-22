'use client'

import { useState, useEffect } from 'react'
import { useSchedule } from '@/contexts/ScheduleContext'
import AuthGuard from '@/components/AuthGuard'
import { getClientApiUrl, CONFIG } from '@/config/constants'
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Shield, 
  X, 
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react'

export default function UsersPageClient() {
  const [users, setUsers] = useState([])
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [registrationForm, setRegistrationForm] = useState({
    user_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    name: ''
  })
  const [registrationLoading, setRegistrationLoading] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Sử dụng CreateScheduleModal và workers từ context
  const { setIsCreateScheduleModalOpen, workers: contextWorkers } = useSchedule()

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

        // Không cần fetch workers nữa - sẽ sử dụng từ ScheduleContext
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Không thể tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Cập nhật workers từ ScheduleContext
  useEffect(() => {
    if (contextWorkers && contextWorkers.length > 0) {
      setWorkers(contextWorkers);
    }
  }, [contextWorkers]);

  const handleRegistrationInputChange = (field, value) => {
    setRegistrationForm(prev => ({ ...prev, [field]: value }))
    setRegistrationError('') // Clear error when user types
  }

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault()
    setRegistrationLoading(true)
    setRegistrationError('')

    // Validate passwords match
    if (registrationForm.password !== registrationForm.confirmPassword) {
      setRegistrationError('Mật khẩu xác nhận không khớp')
      setRegistrationLoading(false)
      return
    }

    // Validate password length
    if (registrationForm.password.length < 6) {
      setRegistrationError('Mật khẩu phải có ít nhất 6 ký tự')
      setRegistrationLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: registrationForm.user_name,
          email: registrationForm.email,
          password: registrationForm.password,
          role: registrationForm.role,
          name: registrationForm.name
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Tạo tài khoản thất bại')
      }
      
      // Reset form and close modal
      setRegistrationForm({
        user_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        name: ''
      })
      setShowRegistrationForm(false)
      
      // Refresh users list
      const usersResponse = await fetch('/api/admin/users')
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData)
      }
      
    } catch (error) {
      setRegistrationError(error.message)
    } finally {
      setRegistrationLoading(false)
    }
  }

  const resetRegistrationForm = () => {
    setRegistrationForm({
      user_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      name: ''
    })
    setRegistrationError('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
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
            className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard requiredRole={['admin']}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-yellow">Quản lý người dùng</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowRegistrationForm(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-brand-green to-brand-yellow text-white rounded-lg hover:from-green-700 hover:to-yellow-600 transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Tạo tài khoản mới
            </button>
            <button
              onClick={() => setIsCreateScheduleModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-brand-green to-brand-yellow text-white rounded-lg hover:from-green-700 hover:to-yellow-600 transition-colors"
            >
              Tạo lịch làm việc
            </button>
          </div>
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
                            ? 'bg-brand-green/10 text-brand-green' 
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
                            : 'bg-brand-yellow/10 text-brand-yellow'
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

        {/* Registration Modal */}
        {showRegistrationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Tạo tài khoản mới</h2>
                <button
                  onClick={() => {
                    setShowRegistrationForm(false)
                    resetRegistrationForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="p-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={registrationForm.name}
                      onChange={(e) => handleRegistrationInputChange("name", e.target.value)}
                      className="py-2 pr-3 pl-10 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="user_name"
                      value={registrationForm.user_name}
                      onChange={(e) => handleRegistrationInputChange("user_name", e.target.value)}
                      className="py-2 pr-3 pl-10 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="Nhập tên đăng nhập"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={registrationForm.email}
                      onChange={(e) => handleRegistrationInputChange("email", e.target.value)}
                      className="py-2 pr-3 pl-10 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={registrationForm.password}
                      onChange={(e) => handleRegistrationInputChange("password", e.target.value)}
                      className="py-2 pr-10 pl-10 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 p-1 rounded transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={registrationForm.confirmPassword}
                      onChange={(e) => handleRegistrationInputChange("confirmPassword", e.target.value)}
                      className="py-2 pr-10 pl-10 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="Nhập lại mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 p-1 rounded transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Shield className="w-4 h-4 text-gray-400" />
                    </div>
                    <select
                      id="role"
                      value={registrationForm.role}
                      onChange={(e) => handleRegistrationInputChange("role", e.target.value)}
                      className="py-2 pr-3 pl-10 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    >
                      <option value="user">Người dùng</option>
                      <option value="admin">Quản trị viên</option>
                      <option value="manager">Quản lý</option>
                      <option value="accountant">Kế toán</option>
                    </select>
                  </div>
                </div>

                {/* Error Message */}
                {registrationError && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{registrationError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={registrationLoading}
                  className="w-full bg-brand-green text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:ring-2 focus:ring-brand-green focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registrationLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Đang tạo tài khoản...
                    </div>
                  ) : (
                    "Tạo tài khoản"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
