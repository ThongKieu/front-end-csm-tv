'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/slices/authSlice'

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    user_name: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()
  const dispatch = useDispatch()

  const validateForm = () => {
    if (!formData.user_name.trim()) {
      setError('Vui lòng nhập tên đăng nhập')
      return false
    }
    
    if (!formData.current_password.trim()) {
      setError('Vui lòng nhập mật khẩu hiện tại')
      return false
    }
    
    if (!formData.new_password.trim()) {
      setError('Vui lòng nhập mật khẩu mới')
      return false
    }
    
    if (formData.new_password.length < 4) {
      setError('Mật khẩu mới phải có ít nhất 4 ký tự')
      return false
    }
    
    if (formData.new_password === formData.current_password) {
      setError('Mật khẩu mới không được trùng với mật khẩu hiện tại')
      return false
    }
    
    if (formData.new_password !== formData.confirm_password) {
      setError('Mật khẩu mới không khớp')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: formData.user_name,
          current_password: formData.current_password,
          new_password: formData.new_password,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Đổi mật khẩu thất bại')
      }
      
      setSuccess('Đổi mật khẩu thành công! Vui lòng đăng nhập lại với mật khẩu mới.')
      
      // Reset form
      setFormData({
        user_name: '',
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
      
      // Logout và chuyển về trang login sau 3 giây
      setTimeout(() => {
        dispatch(logout())
        router.push('/login')
      }, 3000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const inputClassName = `
    block w-full pl-10 pr-10 py-3 text-sm border rounded-lg transition-all duration-200
    bg-white border-gray-300 text-gray-900 placeholder-gray-500 
    hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
  `

  return (
    <div className="flex flex-col justify-center py-12 min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex justify-center items-center w-16 h-16 bg-blue-600 rounded-full shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-bold text-center text-gray-900">
          Đổi mật khẩu
        </h2>
        <p className="mt-3 text-sm text-center text-gray-600">
          Nhập thông tin tài khoản và mật khẩu mới
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-6 py-8 bg-white shadow-xl rounded-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) => handleInputChange('user_name', e.target.value)}
                  className={inputClassName}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.current_password}
                  onChange={(e) => handleInputChange('current_password', e.target.value)}
                  className={inputClassName}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.new_password}
                  onChange={(e) => handleInputChange('new_password', e.target.value)}
                  className={inputClassName}
                  placeholder="Nhập mật khẩu mới (tối thiểu 4 ký tự)"
                  required
                  minLength={4}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  className={inputClassName}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="mr-3 w-5 h-5 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="mr-3 w-5 h-5 text-green-500" />
                <span className="font-medium">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex justify-center px-6 py-3 w-full text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </div>

            {/* Back to Dashboard */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                ← Quay lại Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 