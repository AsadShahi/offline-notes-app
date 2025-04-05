"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

// Helper function to apply theme to the DOM
const applyThemeToDOM = (theme: Theme) => {
  try {

    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark')
    
    // If theme is system, check system preference
    let effectiveTheme = theme
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    // Add theme class
    document.documentElement.classList.add(effectiveTheme)
    
    // For debugging
    console.log(`Applied theme: ${effectiveTheme} (selected: ${theme})`)
  } catch (e) {

    console.error('Error applying theme to DOM:', e)
    
  }
  
}

// Initialize theme based on localStorage or system preference
const initializeTheme = (): Theme => {
  try {
    // Check for stored theme
    const storedData = localStorage.getItem('theme-storage')
    if (storedData) {
      const parsed = JSON.parse(storedData)
      if (parsed?.state?.theme) {
        return parsed.state.theme as Theme
      }
    }
    
    // Default to system if no stored preference
    return 'system'
  } catch (e) {
    console.error('Error initializing theme:', e)
    return 'light' // Default to light mode as fallback
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({

      theme: 'light' as Theme, // Default value, will be overridden by persist
      
      toggleTheme: () => {

        set((state) => {

          let nextTheme: Theme
          
          if (state.theme === 'light') {
            nextTheme = 'dark'
          } else if (state.theme === 'dark') {
            nextTheme = 'system'
          } else {
            nextTheme = 'light'
          }
          
          applyThemeToDOM(nextTheme)

          return { theme: nextTheme }

        })
      },
      
      setTheme: (theme: Theme) => {
        set(() => {
          applyThemeToDOM(theme)
          return { theme }
        })
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // When the store is rehydrated, apply the theme
        if (state) {
          applyThemeToDOM(state.theme)
        }
      },
    }
  )
)

// Add event listener for system theme changes if running in browser
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentTheme = useThemeStore.getState().theme
    if (currentTheme === 'system') {
      applyThemeToDOM('system')
    }
  })
} 