'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { User, Mail, Phone, Building, Calendar, MapPin, Hash, Briefcase, Users, CheckCircle, AlertCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import AddressAutocomplete from '@/components/ui/AddressAutocomplete'

export default function ProfileClient() {
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

  // Helper function để format ngày tháng từ backend sang hiển thị (DD/MM/YYYY)
  const formatDateForDisplay = (dateString) => {
    console.log('formatDateForDisplay input:', dateString, 'type:', typeof dateString)
    
    if (!dateString) {
      console.log('formatDateForDisplay: empty string')
      return ''
    }
    
    // Nếu đã là format DD/MM/YYYY thì giữ nguyên
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      console.log('formatDateForDisplay: already DD/MM/YYYY format')
      return dateString
    }
    
    // Xử lý các format khác nhau từ backend
    try {
      let date
      
      // Nếu là format YYYY-MM-DD (chỉ có ngày)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const parts = dateString.split('-')
        const year = parts[0]
        const month = parts[1]
        const day = parts[2]
        const result = `${day}/${month}/${year}`
        console.log('formatDateForDisplay: YYYY-MM-DD format ->', result)
        return result
      }
      
      // Nếu là format ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
      if (dateString.includes('T') || dateString.includes('Z')) {
        console.log('formatDateForDisplay: ISO 8601 format detected')
        date = new Date(dateString)
      } else {
        // Thử parse như Date object thông thường
        console.log('formatDateForDisplay: trying to parse as Date object')
        date = new Date(dateString)
      }
      
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const result = `${day}/${month}/${year}`
        console.log('formatDateForDisplay: parsed successfully ->', result)
        return result
      } else {
        console.log('formatDateForDisplay: invalid date')
      }
    } catch (error) {
      console.warn('Cannot parse date for display:', dateString, error)
    }
    
    console.log('formatDateForDisplay: no match, returning empty')
    return ''
  }

  // Helper function để format ngày tháng từ hiển thị (DD/MM/YYYY) sang API (YYYY-MM-DD)
  const formatDateForAPI = (dateString) => {
    if (!dateString) return ''
    
    // Nếu đã đúng format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    
    // Nếu là format DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const parts = dateString.split('/')
      const day = parts[0]
      const month = parts[1]
      const year = parts[2]
      return `${year}-${month}-${day}`
    }
    
    // Nếu là Date object hoặc timestamp
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
      }
    } catch (error) {
      console.warn('Cannot parse date for API:', dateString, error)
    }
    
    return ''
  }

  useEffect(() => {
    if (user) {
      console.log('Loading user data - user object:', user)
      console.log('Original date_of_birth:', user.date_of_birth || user.birth_date)
      console.log('All date fields:', {
        date_of_birth: user.date_of_birth,
        birth_date: user.birth_date,
        dateOfBirth: user.dateOfBirth,
        birthDate: user.birthDate,
        dob: user.dob,
        DOB: user.DOB
      })
      
      // Điền thông tin user hiện tại vào form
      const userData = {
        id: user.id || user.user_id || '',
        type: user.type || user.job_type || '',
        code: user.code || user.user_code || '',
        full_name: user.full_name || user.name || user.user_name || '',
        date_of_birth: formatDateForDisplay(user.date_of_birth || user.birth_date || ''),
        address: user.address || user.user_address || '',
        phone_business: user.phone_business || user.business_phone || user.phone || '',
        phone_personal: user.phone_personal || user.personal_phone || '',
        phone_family: user.phone_family || user.family_phone || '',
        role: user.role || user.user_role || '',
      }
      
      console.log('Formatted userData:', userData)
      console.log('Formatted date_of_birth:', userData.date_of_birth)
      setFormData(userData)
    }
  }, [user])

  const validateForm = () => {
    if (!formData.id) {
      setError('ID là bắt buộc')
      return false
    }
    
    if (!formData.full_name || !formData.full_name.trim()) {
      setError('Họ và tên là bắt buộc')
      return false
    }
    
    // Kiểm tra ít nhất có một field được cập nhật (ngoài ID và full_name)
    const hasUpdates = formData.type || 
                      (formData.code && formData.code !== '') || 
                      formData.date_of_birth || 
                      formData.address || 
                      formData.phone_business || 
                      formData.phone_personal || 
                      formData.phone_family || 
                      formData.role
    
    if (!hasUpdates) {
      setError('Vui lòng cập nhật ít nhất một thông tin')
      return false
    }
    
    if (formData.code && (formData.code < 0 || formData.code > 999)) {
      setError('Mã phải từ 0-999')
      return false
    }
    
    // Validate date format (DD/MM/YYYY)
    if (formData.date_of_birth && !/^\d{2}\/\d{2}\/\d{4}$/.test(formData.date_of_birth)) {
      setError('Ngày sinh phải có định dạng DD/MM/YYYY (VD: 01/01/1990)')
      return false
    }
    
    // Validate date is not in the future
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth)
      const today = new Date()
      if (birthDate > today) {
        setError('Ngày sinh không thể là ngày trong tương lai')
        return false
      }
      
      // Validate reasonable age (not older than 150 years)
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age > 150) {
        setError('Ngày sinh không hợp lệ')
        return false
      }
    }
    
    // Validate role
    if (formData.role && !['worker', 'office'].includes(formData.role)) {
      setError('Vai trò phải là "worker" hoặc "office"')
      return false
    }
    
    // Validate phone numbers (optional but if provided, should be valid)
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
      // Chuẩn bị dữ liệu theo đúng format API yêu cầu - chỉ gửi field có giá trị
      const requestData = {
        id: user?.id || user?.user_id || formData.id, // ID bắt buộc
        ...(formData.type && { type: formData.type }), // VP, A, B, C,...
        ...(formData.code && formData.code !== '' && { code: parseInt(formData.code) }), // 0-999, convert to number
        ...(formData.full_name && formData.full_name.trim() && { full_name: formData.full_name.trim() }), // Bắt buộc
        ...(formData.date_of_birth && formData.date_of_birth !== '' && { 
          date_of_birth: formatDateForAPI(formData.date_of_birth) // Format từ DD/MM/YYYY sang YYYY-MM-DD
        }),
        ...(formData.address && formData.address.trim() && { address: formData.address.trim() }),
        ...(formData.phone_business && formData.phone_business.trim() && { phone_business: formData.phone_business.trim() }),
        ...(formData.phone_personal && formData.phone_personal.trim() && { phone_personal: formData.phone_personal.trim() }),
        ...(formData.phone_family && formData.phone_family.trim() && { phone_family: formData.phone_family.trim() }),
        ...(formData.role && { role: formData.role }), // "worker" hoặc "office"
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
        throw new Error(data.message || `Cập nhật thông tin thất bại (${response.status})`)
      }
      
      setSuccess('Cập nhật thông tin thành công!')
      setIsEditing(false)
      
    } catch (error) {
      console.error('Update error:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    // Tự động format ngày sinh khi user nhập
    if (field === 'date_of_birth') {
      // Chỉ cho phép số và dấu /
      const cleaned = value.replace(/[^\d\/]/g, '')
      
      // Tự động thêm dấu / sau 2 số đầu và 4 số cuối
      let formatted = cleaned
      if (cleaned.length >= 2 && !cleaned.includes('/')) {
        formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2)
      }
      if (formatted.length >= 5 && formatted.split('/').length === 2) {
        const parts = formatted.split('/')
        if (parts[1].length >= 4) {
          formatted = parts[0] + '/' + parts[1].substring(0, 2) + '/' + parts[1].substring(2)
        }
      }
      
      // Giới hạn độ dài tối đa
      if (formatted.length > 10) {
        formatted = formatted.substring(0, 10)
      }
      
      setFormData(prev => ({ ...prev, [field]: formatted }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
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
    { value: 'G', label: 'G' },
    { value: 'H', label: 'H' },
    { value: 'I', label: 'I' },
    { value: 'J', label: 'J' },
    { value: 'K', label: 'K' },
    { value: 'L', label: 'L' },
    { value: 'M', label: 'M' },
    { value: 'N', label: 'N' },
    { value: 'O', label: 'O' },
    { value: 'P', label: 'P' },
    { value: 'Q', label: 'Q' },
    { value: 'R', label: 'R' },
    { value: 'S', label: 'S' },
    { value: 'T', label: 'T' },
    { value: 'U', label: 'U' },
    { value: 'V', label: 'V' },
    { value: 'W', label: 'W' },
    { value: 'X', label: 'X' },
    { value: 'Y', label: 'Y' },
    { value: 'Z', label: 'Z' },
  ]

  const roles = [
    { value: 'worker', label: 'Thợ' },
    { value: 'office', label: 'Văn phòng' },
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
              <div className="flex items-center p-4 mb-6 text-sm rounded-lg border text-brand-green bg-brand-green/10 border-brand-green/20">
                <CheckCircle className="mr-3 w-5 h-5 text-brand-green" />
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
                      type="text"
                      value={formData.date_of_birth}
                      onChange={(e) => {
                        handleInputChange('date_of_birth', e.target.value)
                      }}
                      disabled={!isEditing}
                      className={inputClassName(!isEditing)}
                      placeholder="01/01/1990"
                      pattern="\d{2}/\d{2}/\d{4}"
                      inputMode="numeric"
                      autoComplete="off"
                      data-lpignore="true"
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
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={(value) => handleInputChange('address', value)}
                    disabled={!isEditing}
                    placeholder="Nhập địa chỉ..."
                    className={inputClassName(!isEditing)}
                  />
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
                          date_of_birth: formatDateForDisplay(user.date_of_birth || user.birth_date || ''),
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
