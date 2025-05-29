'use client'

export default function TemplateConfig({ 
  templateConfig, 
  onConfigChange 
}) {
  return (
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
            onChange={(e) => onConfigChange('template_id', e.target.value)}
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
            onChange={(e) => onConfigChange('tracking_id', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  )
} 