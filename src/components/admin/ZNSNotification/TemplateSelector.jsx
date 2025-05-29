'use client'

import { ChevronDown } from 'lucide-react'

export default function TemplateSelector({ 
  templates, 
  selectedTemplate, 
  onTemplateChange, 
  isOpen, 
  onToggle 
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        <span>{selectedTemplate.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {Object.values(templates).map((template) => (
            <button
              key={template.id}
              onClick={() => onTemplateChange(template)}
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
  )
} 