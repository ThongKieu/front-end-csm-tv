'use client'

import { useState } from 'react'
import { Settings, AlertCircle } from 'lucide-react'
import * as ExcelJS from 'exceljs'
import { ZNS_TEMPLATES } from './constants'
import TemplateSelector from './TemplateSelector'
import TemplateConfig from './TemplateConfig'
import SendModeSelector from './SendModeSelector'
import ManualInputForm from './ManualInputForm'
import FileUpload from './FileUpload'
import DataPreview from './DataPreview'
import SendButton from './SendButton'

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
  const [sendMode, setSendMode] = useState('bulk')
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

      const headers = []
      worksheet.getRow(1).eachCell((cell) => {
        headers.push(cell.value)
      })

      const missingColumns = selectedTemplate.requiredColumns.filter(col => !headers.includes(col))
      
      if (missingColumns.length > 0) {
        setError(`Thiếu các cột bắt buộc: ${missingColumns.join(', ')}`)
        return
      }

      const jsonData = []
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return
        
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

      setPreview(jsonData.slice(0, 5))
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
        sendData = preview.map(row => ({
          ...selectedTemplate.dataMapping,
          template_id: templateConfig.template_id,
          tracking_id: templateConfig.tracking_id,
          template_data: selectedTemplate.dataMapping.template_data(row)
        }))
      } else {
        sendData = [{
          ...selectedTemplate.dataMapping,
          template_id: templateConfig.template_id,
          tracking_id: templateConfig.tracking_id,
          template_data: selectedTemplate.dataMapping.template_data(manualInput)
        }]
      }

  

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
            <SendModeSelector
              sendMode={sendMode}
              onModeChange={setSendMode}
            />

            <TemplateSelector
              templates={ZNS_TEMPLATES}
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
              isOpen={isTemplateOpen}
              onToggle={() => setIsTemplateOpen(!isTemplateOpen)}
            />

            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="p-2 border rounded-lg hover:bg-gray-50"
              title="Cấu hình template"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isConfigOpen && (
          <TemplateConfig
            templateConfig={templateConfig}
            onConfigChange={(field, value) => 
              setTemplateConfig(prev => ({ ...prev, [field]: value }))
            }
          />
        )}

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
          <ManualInputForm
            requiredColumns={selectedTemplate.requiredColumns}
            manualInput={manualInput}
            onInputChange={handleManualInputChange}
          />
        ) : (
          <FileUpload
            onFileUpload={handleFileUpload}
            fileName={file?.name}
          />
        )}

        {sendMode === 'bulk' && (
          <DataPreview preview={preview} />
        )}

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

        <SendButton
          disabled={(sendMode === 'bulk' && !file) || loading}
          loading={loading}
          onClick={handleSendZNS}
        />
      </div>
    </div>
  )
} 