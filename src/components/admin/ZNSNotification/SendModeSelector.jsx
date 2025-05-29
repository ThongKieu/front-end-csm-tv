'use client'

import { Users, User } from 'lucide-react'

export default function SendModeSelector({ 
  sendMode, 
  onModeChange 
}) {
  return (
    <div className="flex items-center space-x-2 border rounded-lg p-1">
      <button
        onClick={() => onModeChange('single')}
        className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
          sendMode === 'single' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
        }`}
      >
        <User className="w-4 h-4" />
        <span>Đơn lẻ</span>
      </button>
      <button
        onClick={() => onModeChange('bulk')}
        className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
          sendMode === 'bulk' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
        }`}
      >
        <Users className="w-4 h-4" />
        <span>Hàng loạt</span>
      </button>
    </div>
  )
} 