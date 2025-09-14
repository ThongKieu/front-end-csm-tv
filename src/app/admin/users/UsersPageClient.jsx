'use client'

import { useState } from 'react'
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
      
      // Show success message
      alert('Tạo tài khoản thành công!')
      
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


  return (
    <div className="flex justify-center items-center px-4 py-6 w-full min-h-screen bg-gradient-to-br from-brand-green/8 to-brand-yellow/8">
      <div className="w-full max-w-[400px] sm:max-w-md">
        <div className="p-6 rounded-2xl border shadow-2xl backdrop-blur-sm sm:p-8 bg-white/95 border-white/20">
          <div className="mb-6 text-center">
            <div className="inline-flex justify-center items-center mb-4 w-12 h-12 bg-gradient-to-r rounded-full shadow-lg sm:w-16 sm:h-16 from-brand-green to-brand-yellow">
              <UserPlus className="w-6 h-6 text-white sm:w-8 sm:h-8" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Đăng ký tài khoản</h1>
            <p className="text-sm text-gray-600 sm:text-base">Tạo tài khoản mới cho hệ thống</p>
          </div>

          <form onSubmit={handleRegistrationSubmit} className="space-y-3 sm:space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block mb-1 text-xs font-medium text-gray-700 sm:text-sm">
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
                  className="py-2.5 pr-3 pl-10 w-full text-sm rounded-lg border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:bg-white transition-all duration-200"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="user_name" className="block mb-1 text-xs font-medium text-gray-700 sm:text-sm">
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
                  className="py-2.5 pr-3 pl-10 w-full text-sm rounded-lg border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:bg-white transition-all duration-200"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-xs font-medium text-gray-700 sm:text-sm">
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
                  className="py-2.5 pr-3 pl-10 w-full text-sm rounded-lg border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:bg-white transition-all duration-200"
                  placeholder="Nhập email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-1 text-xs font-medium text-gray-700 sm:text-sm">
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
                  className="py-2.5 pr-10 pl-10 w-full text-sm rounded-lg border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:bg-white transition-all duration-200"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 p-1 text-gray-400 rounded transition-colors transform -translate-y-1/2 hover:text-gray-600"
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
              <label htmlFor="confirmPassword" className="block mb-1 text-xs font-medium text-gray-700 sm:text-sm">
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
                  className="py-2.5 pr-10 pl-10 w-full text-sm rounded-lg border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:bg-white transition-all duration-200"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 p-1 text-gray-400 rounded transition-colors transform -translate-y-1/2 hover:text-gray-600"
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
              <label htmlFor="role" className="block mb-1 text-xs font-medium text-gray-700 sm:text-sm">
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
                  className="py-2.5 pr-3 pl-10 w-full text-sm rounded-lg border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:bg-white transition-all duration-200"
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
              <div className="p-2.5 bg-red-50/80 rounded-lg border border-red-200/50">
                <p className="text-xs text-red-600">{registrationError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registrationLoading}
              className="px-6 py-3 w-full text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-brand-green to-brand-yellow shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {registrationLoading ? (
                <span className="flex justify-center items-center">
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Đang tạo tài khoản...
                </span>
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
