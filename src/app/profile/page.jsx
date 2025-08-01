'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { User, Mail, Phone, Building, Calendar, MapPin, Hash, Briefcase, Users, CheckCircle, AlertCircle } from 'lucide-react'
import Header from '@/components/layout/Header'

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    id: '',
    type: '',
    code: '',
    full_name: '',
    date_of_birth: '',
    address: '',
    phone_business: '',
    phone_personal: '',
    phone_family: '',
    role: '',
  })

  useEffect(() => {
    if (user) {
      // Điền thông tin user hiện tại vào form
      setFormData({
        id: user.id || user.user_id || '',
        type: user.type || user.job_type || '',
        code: user.code || user.user_code || '',
        full_name: user.full_name || user.name || user.user_name || '',
        date_of_birth: user.date_of_birth || user.birth_date || '',
        address: user.address || user.user_address || '',
        phone_business: user.phone_business || user.business_phone || user.phone || '',
        phone_personal: user.phone_personal || user.personal_phone || '',
        phone_family: user.phone_family || user.family_phone || '',
        role: user.role || user.user_role || '',
      })
    }
  }, [user])

  const validateForm = () => {
    if (!formData.id) {
      setError('ID là bắt buộc')
      return false
    }
    
    if (!formData.full_name.trim()) {
      setError('Họ và tên là bắt buộc')
      return false
    }
    
    if (formData.code && (formData.code < 0 || formData.code > 999)) {
      setError('Mã phải từ 0-999')
      return false
    }
    
    if (formData.phone_business && !/^[0-9+\-\s()]+$/.test(formData.phone_business)) {
      setError('Số điện thoại công ty không hợp lệ')
      return false
    }
    
    if (formData.phone_personal && !/^[0-9+\-\s()]+$/.test(formData.phone_personal)) {
      setError('Số điện thoại cá nhân không hợp lệ')
      return false
    }
    
    if (formData.phone_family && !/^[0-9+\-\s()]+$/.test(formData.phone_family)) {
      setError('Số điện thoại gia đình không hợp lệ')
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
      // Lấy ID từ user object hiện tại thay vì từ form
      const requestData = {
        ...formData,
        id: user?.id || user?.user_id || formData.id, // Ưu tiên lấy từ user object
      }
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật thông tin thất bại')
      }
      
      setSuccess('Cập nhật thông tin thành công!')
      setIsEditing(false)
      
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

  const jobTypes = [
    { value: 'VP', label: 'VP' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
  ]

  const roles = [
    { value: 'worker', label: 'Worker' },
    { value: 'office', label: 'Office' },
  ]

  const inputClassName = (isDisabled = false) => `
    block w-full pl-10 pr-3 py-3 text-sm border rounded-lg transition-all duration-200
    ${isDisabled 
      ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
    }
  `

  const selectClassName = (isDisabled = false) => `
    block w-full pl-10 pr-10 py-3 text-sm border rounded-lg transition-all duration-200 appearance-none
    ${isDisabled 
      ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' 
      : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
    }
  `

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="p-6 pt-8 mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
          <p className="mt-2 text-gray-600">Quản lý và cập nhật thông tin tài khoản của bạn</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-lg">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Thông tin chi tiết</h3>
                <p className="mt-1 text-sm text-gray-500">Cập nhật thông tin cá nhân và liên hệ</p>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg border border-transparent shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="mr-3 w-5 h-5 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center p-4 mb-6 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="mr-3 w-5 h-5 text-green-500" />
                <span className="font-medium">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* ID - Luôn disabled */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    ID <span className="text-xs text-gray-400">(Không thể chỉnh sửa)</span>
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Hash className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={formData.id}
                      disabled={true}
                      className={inputClassName(true)}
                      readOnly
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Loại công việc
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      disabled={!isEditing}
                      className={selectClassName(!isEditing)}
                    >
                      <option value="">Chọn loại</option>
                      {jobTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Code */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Mã (0-999)
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Hash className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      disabled={!isEditing}
                      className={inputClassName(!isEditing)}
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      disabled={!isEditing}
                      className={inputClassName(!isEditing)}
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Ngày sinh
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      disabled={!isEditing}
                      className={inputClassName(!isEditing)}
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Vai trò
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      disabled={!isEditing}
                      className={selectClassName(!isEditing)}
                    >
                      <option value="">Chọn vai trò</option>
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                    <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Địa chỉ
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      className={inputClassName(!isEditing)}
                    />
                  </div>
                </div>

                {/* Phone Business */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Số điện thoại công ty
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone_business}
                      onChange={(e) => handleInputChange('phone_business', e.target.value)}
                      disabled={!isEditing}
                      className={inputClassName(!isEditing)}
                      placeholder="VD: 0123456789"
                    />
                  </div>
                </div>

                {/* Phone Personal */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Số điện thoại cá nhân
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone_personal}
                      onChange={(e) => handleInputChange('phone_personal', e.target.value)}
                      disabled={!isEditing}
                      className={inputClassName(!isEditing)}
                      placeholder="VD: 0123456789"
                    />
                  </div>
                </div>

                {/* Phone Family */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Số điện thoại gia đình
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone_family}
                      onChange={(e) => handleInputChange('phone_family', e.target.value)}
                      disabled={!isEditing}
                      className={inputClassName(!isEditing)}
                      placeholder="VD: 0123456789"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end mt-8 space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setError('')
                      setSuccess('')
                      // Reset form data
                      if (user) {
                        setFormData({
                          id: user.id || user.user_id || '',
                          type: user.type || user.job_type || '',
                          code: user.code || user.user_code || '',
                          full_name: user.full_name || user.name || user.user_name || '',
                          date_of_birth: user.date_of_birth || user.birth_date || '',
                          address: user.address || user.user_address || '',
                          phone_business: user.phone_business || user.business_phone || user.phone || '',
                          phone_personal: user.phone_personal || user.personal_phone || '',
                          phone_family: user.phone_family || user.family_phone || '',
                          role: user.role || user.user_role || '',
                        })
                      }
                    }}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg border border-transparent shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 