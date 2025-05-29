'use client'

import { useState } from 'react'
import { Upload, Send, AlertCircle, ChevronDown, Settings, Users, User } from 'lucide-react'
import * as ExcelJS from 'exceljs'

const ZNS_TEMPLATES = {
  QUOTATION: {
    id: 'quotation',
    name: 'Báo giá',
    description: 'Gửi báo giá cho khách hàng',
    template_id: '231677',
    tracking_id: '120199',
    requiredColumns: ['phone', 'name', 'date', 'code', 'warranty'],
    dataMapping: {
      phone: (row) => "84" + ((row.phone + "").startsWith("0") ? row.phone.substring(1, 10) : row.phone),
      template_id: '231677',
      template_data: (row) => ({
        date: row.date,
        code: row.code,
        customer_name: row.name,
        status: "Thành công",
        warranty: row.warranty
      }),
      tracking_id: '120199'
    }
  },
  THANK_YOU: {
    id: 'thank_you',
    name: 'Cảm ơn',
    description: 'Gửi lời cảm ơn sau khi hoàn thành dịch vụ',
    template_id: '231678',
    tracking_id: '120200',
    requiredColumns: ['phone', 'name', 'service'],
    dataMapping: {
      phone: (row) => "84" + ((row.phone + "").startsWith("0") ? row.phone.substring(1, 10) : row.phone),
      template_id: '231678',
      template_data: (row) => ({
        customer_name: row.name,
        service: row.service,
        status: "Hoàn thành"
      }),
      tracking_id: '120200'
    }
  },
  // BULK_NOTIFICATION: {
  //   id: 'bulk_notification',
  //   name: 'Thông báo hàng loạt',
  //   description: 'Gửi thông báo cho nhiều khách hàng',
  //   template_id: '231679',
  //   tracking_id: '120201',
  //   requiredColumns: ['phone', 'name', 'message'],
  //   dataMapping: {
  //     phone: (row) => "84" + ((row.phone + "").startsWith("0") ? row.phone.substring(1, 10) : row.phone),
  //     template_id: '231679',
  //     template_data: (row) => ({
  //       customer_name: row.name,
  //       message: row.message
  //     }),
  //     tracking_id: '120201'
  //   }
  // },
  // SINGLE_NOTIFICATION: {
  //   id: 'single_notification',
  //   name: 'Thông báo đơn lẻ',
  //   description: 'Gửi thông báo cho một khách hàng',
  //   template_id: '231680',
  //   tracking_id: '120202',
  //   requiredColumns: ['phone', 'name', 'message'],
  //   dataMapping: {
  //     phone: (row) => "84" + ((row.phone + "").startsWith("0") ? row.phone.substring(1, 10) : row.phone),
  //     template_id: '231680',
  //     template_data: (row) => ({
  //       customer_name: row.name,
  //       message: row.message
  //     }),
  //     tracking_id: '120202'
  //   }
  // }
}

export default function ZNSNotification() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(ZNS_TEMPLATES.QUOTATION)
  const [isTemplateOpen, setIsTemplateOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [templateConfig, setTemplateConfig] = useState({
    template_id: selectedTemplate.template_id,
    tracking_id: selectedTemplate.tracking_id
  })
  const [sendMode, setSendMode] = useState('bulk') // 'single' or 'bulk'
  const [manualInput, setManualInput] = useState({
    phone: '',
    name: '',
    date: '',
    code: '',
    warranty: '',
    service: '',
    message: ''
  })

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Kiểm tra định dạng file
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Vui lòng chọn file Excel (.xlsx hoặc .xls)')
      return
    }

    setFile(file)
    setError('')
    setSuccess('')

    try {
      const workbook = new ExcelJS.Workbook()
      const arrayBuffer = await file.arrayBuffer()
      await workbook.xlsx.load(arrayBuffer)
      
      const worksheet = workbook.getWorksheet(1)
      if (!worksheet) {
        setError('Không tìm thấy dữ liệu trong file Excel')
        return
      }

      // Lấy headers từ dòng đầu tiên
      const headers = []
      worksheet.getRow(1).eachCell((cell) => {
        headers.push(cell.value)
      })

      // Kiểm tra các cột bắt buộc
      const missingColumns = selectedTemplate.requiredColumns.filter(col => !headers.includes(col))
      
      if (missingColumns.length > 0) {
        setError(`Thiếu các cột bắt buộc: ${missingColumns.join(', ')}`)
        return
      }

      // Chuyển đổi dữ liệu thành JSON
      const jsonData = []
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return // Bỏ qua dòng header
        
        const rowData = {}
        row.eachCell((cell, colNumber) => {
          rowData[headers[colNumber - 1]] = cell.value
        })
        jsonData.push(rowData)
      })

      if (jsonData.length === 0) {
        setError('File Excel không có dữ liệu')
        return
      }

      setPreview(jsonData.slice(0, 5)) // Hiển thị 5 dòng đầu tiên
    } catch (error) {
      console.error('Error reading Excel file:', error)
      setError('Không thể đọc file Excel')
    }
  }

  const handleManualInputChange = (field, value) => {
    setManualInput(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSendZNS = async () => {
    if (sendMode === 'bulk' && !file) {
      setError('Vui lòng chọn file Excel')
      return
    }

    if (sendMode === 'single') {
      // Validate required fields for single mode
      const missingFields = selectedTemplate.requiredColumns.filter(
        field => !manualInput[field]
      )
      if (missingFields.length > 0) {
        setError(`Vui lòng nhập đầy đủ thông tin: ${missingFields.join(', ')}`)
        return
      }
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let sendData = []
      
      if (sendMode === 'bulk') {
        // Prepare data from Excel file
        sendData = preview.map(row => ({
          ...selectedTemplate.dataMapping,
          template_id: templateConfig.template_id,
          tracking_id: templateConfig.tracking_id,
          template_data: selectedTemplate.dataMapping.template_data(row)
        }))
      } else {
        // Prepare data from manual input
        sendData = [{
          ...selectedTemplate.dataMapping,
          template_id: templateConfig.template_id,
          tracking_id: templateConfig.tracking_id,
          template_data: selectedTemplate.dataMapping.template_data(manualInput)
        }]
      }

      console.log('Data to send:', sendData)

      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess('Gửi ZNS thành công!')
      setFile(null)
      setPreview([])
      if (sendMode === 'single') {
        setManualInput({
          phone: '',
          name: '',
          date: '',
          code: '',
          warranty: '',
          service: '',
          message: ''
        })
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi gửi ZNS')
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template)
    setTemplateConfig({
      template_id: template.template_id,
      tracking_id: template.tracking_id
    })
    setIsTemplateOpen(false)
    setFile(null)
    setPreview([])
  }

  return (
    <div className="max-w-4xl h-[calc(100vh-70px)] mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Gửi thông báo ZNS
          </h2>
          
          <div className="flex items-center space-x-4">
            {/* Send Mode Selection */}
            <div className="flex items-center space-x-2 border rounded-lg p-1">
              <button
                onClick={() => setSendMode('single')}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                  sendMode === 'single' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Đơn lẻ</span>
              </button>
              <button
                onClick={() => setSendMode('bulk')}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                  sendMode === 'bulk' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Hàng loạt</span>
              </button>
            </div>

            {/* Template Selection Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTemplateOpen(!isTemplateOpen)}
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <span>{selectedTemplate.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isTemplateOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {Object.values(ZNS_TEMPLATES).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateChange(template)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                        selectedTemplate.id === template.id ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Template Configuration Button */}
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="p-2 border rounded-lg hover:bg-gray-50"
              title="Cấu hình template"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Configuration */}
        {isConfigOpen && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">Cấu hình template</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template ID
                </label>
                <input
                  type="text"
                  value={templateConfig.template_id}
                  onChange={(e) => setTemplateConfig(prev => ({ ...prev, template_id: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking ID
                </label>
                <input
                  type="text"
                  value={templateConfig.tracking_id}
                  onChange={(e) => setTemplateConfig(prev => ({ ...prev, tracking_id: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* Template Description */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Cấu trúc dữ liệu cần có:</h3>
          <ul className="list-disc list-inside text-blue-800">
            {selectedTemplate.requiredColumns.map((column) => (
              <li key={column}>
                {column === 'phone' && 'Số điện thoại (phone)'}
                {column === 'name' && 'Tên khách hàng (name)'}
                {column === 'date' && 'Ngày (date)'}
                {column === 'code' && 'Mã (code)'}
                {column === 'warranty' && 'Bảo hành (warranty)'}
                {column === 'service' && 'Dịch vụ (service)'}
                {column === 'message' && 'Nội dung thông báo (message)'}
              </li>
            ))}
          </ul>
        </div>

        {sendMode === 'single' ? (
          /* Manual Input Form */
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              {selectedTemplate.requiredColumns.map((field) => (
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
                    onChange={(e) => handleManualInputChange(field, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={`Nhập ${field}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Upload Section */
          <div className="mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <span className="text-gray-600">
                  {file ? file.name : 'Chọn file Excel để upload'}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  Hỗ trợ file .xlsx hoặc .xls
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {sendMode === 'bulk' && preview.length > 0 && (
          <div className="mb-8 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xem trước dữ liệu
            </h3>
            <div className="overflow-auto flex-1">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {Object.keys(preview[0]).map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Hiển thị {preview.length} dòng đầu tiên
            </p>
          </div>
        )}

        {/* Error & Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSendZNS}
          disabled={(sendMode === 'bulk' && !file) || loading}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            (sendMode === 'bulk' && !file) || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Gửi ZNS
            </>
          )}
        </button>
      </div>
    </div>
  )
} 