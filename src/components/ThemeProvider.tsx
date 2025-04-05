"use client"

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/store/themeStore'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, toggleTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  // Initial theme setup on component mount
  useEffect(() => {
    setMounted(true)
    // First, remove any existing theme classes to start fresh
    document.documentElement.classList.remove('light', 'dark')
    
    // Then apply the current theme from the store
    document.documentElement.classList.add(theme)
    
    // Force a repaint to ensure styles are applied
    document.body.style.color = ''
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change theme if user has selected system preference
      if (theme === 'system' as const) {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(e.matches ? 'dark' : 'light')
      }
    }
    
    // Add event listener for theme change
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // Apply theme class whenever theme changes
  useEffect(() => {
    if (!mounted) return
    
    console.log('Theme changed:', theme)
    document.documentElement.classList.remove('light', 'dark')
    
    // If theme is system, check system preference
    if (theme === 'system' as const) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.add(isDarkMode ? 'dark' : 'light')
    } else {
      document.documentElement.classList.add(theme)
    }
    
    // Log current theme state for debugging
    console.log('Current HTML classes:', document.documentElement.className)
    console.log('Dark mode active:', document.documentElement.classList.contains('dark'))
  }, [theme, mounted])

  // Debug floating button to toggle theme directly
  const debugToggle = (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={toggleTheme}
        style={{
          backgroundColor: theme === 'dark' ? '#1e3a8a' : '#3b82f6',
          color: 'white',
          fontWeight: 'bold',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem'
        }}
      >
        Toggle Theme ({theme})
      </button>
    </div>
  )

  return (
    <>
      {children}
      {debugToggle}
    </>
  )
} 