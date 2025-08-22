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
      setError('Xác nhận mật khẩu không khớp')
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
          user_name: formData.user_name.trim(),
          current_password: formData.current_password,
          new_password: formData.new_password,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Đổi mật khẩu thất bại')
      }
      
      setSuccess('Đổi mật khẩu thành công! Đang đăng xuất...')
      
      // Đăng xuất và chuyển về trang login sau 2 giây
      setTimeout(() => {
        dispatch(logout())
        router.push('/login')
      }, 2000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const inputClassName = "block w-full pl-10 pr-12 py-3 text-sm border border-gray-300 rounded-lg transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đổi mật khẩu</h2>
            <p className="text-gray-600">Cập nhật mật khẩu mới cho tài khoản của bạn</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="mr-3 w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center p-4 mb-6 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="mr-3 w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="font-medium">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
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
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.current_password}
                  onChange={(e) => handleInputChange('current_password', e.target.value)}
                  className={inputClassName}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.new_password}
                  onChange={(e) => handleInputChange('new_password', e.target.value)}
                  className={inputClassName}
                  placeholder="Nhập mật khẩu mới (tối thiểu 4 ký tự)"
                  required
                  minLength={4}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  className={inputClassName}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold text-sm shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                'Đổi mật khẩu'
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}