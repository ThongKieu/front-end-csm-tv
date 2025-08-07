'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-brand-green',
    textColor: 'text-white'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-brand-yellow',
    textColor: 'text-white'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-brand-yellow',
    textColor: 'text-white'
  },
  info: {
    icon: Info,
    bgColor: 'bg-brand-green',
    textColor: 'text-white'
  }
}

export function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)
  const Icon = TOAST_TYPES[type].icon

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${TOAST_TYPES[type].bgColor} ${TOAST_TYPES[type].textColor}`}
      >
        <Icon className="w-5 h-5" />
        <p>{message}</p>
      </div>
    </div>,
    document.body
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
} 