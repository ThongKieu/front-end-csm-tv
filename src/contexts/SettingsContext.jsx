'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('vi')
  const [fontSize, setFontSize] = useState('medium')
  const [notifications, setNotifications] = useState({
    email: true,
    zns: false,
    push: true
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light'
    const savedLanguage = localStorage.getItem('language') || 'vi'
    const savedFontSize = localStorage.getItem('fontSize') || 'medium'
    const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || {
      email: true,
      zns: false,
      push: true
    }

    setTheme(savedTheme)
    setLanguage(savedLanguage)
    setFontSize(savedFontSize)
    setNotifications(savedNotifications)

    // Apply theme
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme) => {
    const root = document.documentElement
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.remove('light', 'dark')
      root.classList.add(systemTheme)
    } else {
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
    }
  }

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        applyTheme('system')
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const updateLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const updateFontSize = (newSize) => {
    setFontSize(newSize)
    localStorage.setItem('fontSize', newSize)
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[newSize]
  }

  const updateNotifications = (newSettings) => {
    setNotifications(newSettings)
    localStorage.setItem('notifications', JSON.stringify(newSettings))
  }

  return (
    <SettingsContext.Provider
      value={{
        theme,
        language,
        fontSize,
        notifications,
        updateTheme,
        updateLanguage,
        updateFontSize,
        updateNotifications
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
} 