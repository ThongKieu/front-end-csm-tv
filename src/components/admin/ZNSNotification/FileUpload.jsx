'use client'

import { Upload } from 'lucide-react'

export default function FileUpload({ 
  onFileUpload, 
  fileName 
}) {
  return (
    <div className="mb-8">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-gray-600">
            {fileName || 'Chọn file Excel để upload'}
          </span>
          <span className="text-sm text-gray-500 mt-1">
            Hỗ trợ file .xlsx hoặc .xls
          </span>
        </label>
      </div>
    </div>
  )
} 