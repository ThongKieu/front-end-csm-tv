'use client'

export default function ManualInputForm({ 
  requiredColumns, 
  manualInput, 
  onInputChange 
}) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 gap-4">
        {requiredColumns.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field === 'phone' && 'Số điện thoại'}
              {field === 'name' && 'Tên khách hàng'}
              {field === 'date' && 'Ngày'}
              {field === 'code' && 'Mã'}
              {field === 'warranty' && 'Bảo hành'}
              {field === 'service' && 'Dịch vụ'}
              {field === 'message' && 'Nội dung thông báo'}
            </label>
            <input
              type={field === 'date' ? 'date' : 'text'}
              value={manualInput[field]}
              onChange={(e) => onInputChange(field, e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder={`Nhập ${field}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
} 