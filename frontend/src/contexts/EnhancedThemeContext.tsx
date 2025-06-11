import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 🎨 Enhanced Theme System - Core Types
export type ThemeId = 
  | 'sanctuary-purple' 
  | 'dark' 
  | 'light' 
  | 'neon' 
  | 'forest' 
  | 'ocean' 
  | 'cyberpunk' 
  | 'minimal' 
  | 'high-contrast'
  | 'custom'

export type LayoutSize = 'compact' | 'comfortable' | 'spacious'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  surfaceSecondary: string
  text: string
  textSecondary: string
  textMuted: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

export interface ThemeEffects {
  particlesEnabled: boolean
  particleDensity: number
  animationSpeed: number
  gradientBackground: boolean
  glassEffect: boolean
  shadowIntensity: number
  borderRadius: number
}

export interface AccessibilitySettings {
  reduceMotion: boolean
  highContrast: boolean
  fontSize: number // 12-24px
  focusVisible: boolean
  screenReaderOptimized: boolean
}

export interface Theme {
  id: ThemeId
  name: string
  description: string
  colors: ThemeColors
  effects: ThemeEffects
  accessibility: AccessibilitySettings
  cssVariables: Record<string, string>
}

// 🎨 Predefined Theme Definitions
export const themes: Record<ThemeId, Theme> = {
  'sanctuary-purple': {
    id: 'sanctuary-purple',
    name: 'Sanctuary Purple',
    description: 'The original Podplay Sanctuary experience with purple elegance',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#C084FC',
      background: '#0F0F23',
      surface: '#1E1B3A',
      surfaceSecondary: '#2D2A4A',
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      border: '#374151',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    },
    effects: {
      particlesEnabled: true,
      particleDensity: 30,
      animationSpeed: 1,
      gradientBackground: true,
      glassEffect: true,
      shadowIntensity: 0.3,
      borderRadius: 12
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      fontSize: 16,
      focusVisible: true,
      screenReaderOptimized: true
    },
    cssVariables: {}
  },
  'dark': {
    id: 'dark',
    name: 'Midnight Dark',
    description: 'Deep, rich dark theme for focused development',
    colors: {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#8B5CF6',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      surfaceSecondary: '#2A2A2A',
      text: '#FFFFFF',
      textSecondary: '#E5E5E5',
      textMuted: '#A3A3A3',
      border: '#404040',
      success: '#22C55E',
      warning: '#EAB308',
      error: '#EF4444',
      info: '#3B82F6'
    },
    effects: {
      particlesEnabled: false,
      particleDensity: 0,
      animationSpeed: 0.8,
      gradientBackground: false,
      glassEffect: false,
      shadowIntensity: 0.5,
      borderRadius: 8
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      fontSize: 16,
      focusVisible: true,
      screenReaderOptimized: true
    },
    cssVariables: {}
  },
  'light': {
    id: 'light',
    name: 'Pristine Light',
    description: 'Clean, bright theme for daytime productivity',
    colors: {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      surfaceSecondary: '#F1F5F9',
      text: '#0F172A',
      textSecondary: '#334155',
      textMuted: '#64748B',
      border: '#E2E8F0',
      success: '#16A34A',
      warning: '#CA8A04',
      error: '#DC2626',
      info: '#2563EB'
    },
    effects: {
      particlesEnabled: false,
      particleDensity: 0,
      animationSpeed: 0.8,
      gradientBackground: false,
      glassEffect: false,
      shadowIntensity: 0.1,
      borderRadius: 8
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      fontSize: 16,
      focusVisible: true,
      screenReaderOptimized: true
    },
    cssVariables: {}
  },
  'neon': {
    id: 'neon',
    name: 'Neon Pulse',
    description: 'Electric cyberpunk aesthetics with glowing accents',
    colors: {
      primary: '#00D9FF',
      secondary: '#FF0080',
      accent: '#FFFF00',
      background: '#000814',
      surface: '#001D3D',
      surfaceSecondary: '#003566',
      text: '#FFFFFF',
      textSecondary: '#00D9FF',
      textMuted: '#8ECAE6',
      border: '#0077B6',
      success: '#00FF88',
      warning: '#FFAA00',
      error: '#FF0066',
      info: '#00AAFF'
    },
    effects: {
      particlesEnabled: true,
      particleDensity: 50,
      animationSpeed: 1.5,
      gradientBackground: true,
      glassEffect: true,
      shadowIntensity: 0.8,
      borderRadius: 16
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      fontSize: 16,
      focusVisible: true,
      screenReaderOptimized: true
    },
    cssVariables: {}
  },
  'forest': {
    id: 'forest',
    name: 'Forest Sanctuary',
    description: 'Natural greens and earthy tones for peaceful coding',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10B981',
      background: '#064E3B',
      surface: '#0F766E',
      surfaceSecondary: '#134E4A',
      text: '#F0FDF4',
      textSecondary: '#A7F3D0',
      textMuted: '#6EE7B7',
      border: '#065F46',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4'
    },
    effects: {
      particlesEnabled: true,
      particleDensity: 25,
      animationSpeed: 0.6,
      gradientBackground: true,
      glassEffect: true,
      shadowIntensity: 0.4,
      borderRadius: 12
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      fontSize: 16,
      focusVisible: true,
      screenReaderOptimized: true
    },
    cssVariables: {}
  },
  'ocean': {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Calming blues and ocean-inspired gradients',
    colors: {
      primary: '#0EA5E9',
      secondary: '#0284C7',
      accent: '#38BDF8',
      background: '#0C4A6E',
      surface: '#075985',
      surfaceSecondary: '#0369A1',
      text: '#F0F9FF',
      textSecondary: '#BAE6FD',
      textMuted: '#7DD3FC',
      border: '#0284C7',
      success: '#06B6D4',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    },
    effects: {
      particlesEnabled: true,
      particleDensity: 40,
      animationSpeed: 0.8,
      gradientBackground: true,
      glassEffect: true,
      shadowIntensity: 0.5,
      borderRadius: 16
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      fontSize: 16,
      focusVisible: true,
      screenReaderOptimized: true
    },
    cssVariables: {}
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Cyberpunk Grid',
    description: 'Matrix-inspired theme with terminal aesthetics',
    colors: {
      primary: '#00FF41',
      secondary: '#00CC33',
      accent: '#FFFF00',
      background: '#000000',
      surface: '#001100',
      surfaceSecondary: '#002200',
      text: '#00FF41',
      textSecondary: '#00CC33',
      textMuted: '#008822',
      border: '#004400',
      success: '#00FF00',
      warning: '#FFFF00',
      error: '#FF0040',
      info: '#00FFFF'
    },
    effects: {
      particlesEnabled: true,
      particleDensity: 60,
      animationSpeed: 2,
      gradientBackground: false,
      glassEffect: false,
      shadowIntensity: 0.9,
      borderRadius: 0
    },
    accessibility: {
      reduceMotion: false,
      highContrast: true,
      fontSize: 16,
      focusVisible: true,
      screenReaderOptimized: true
    },
    cssVariables: {}
  },
  'minimal': {
    id: 'minimal',
    name: 'Zen Minimal',
    description: 'Distraction-free environment for deep focus',
    colors: {
      primary: '#374151',
      secondary: '#4B5563',
      accent: '#6B7280',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      surfaceSecondary: '#F5F5F5',
      text: '#111827',
      textSecondary: '#374151',
      textMuted: '#6B7280',
      border: '#D1D5DB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    },
    effects: {
      particlesEnabled: false,
      particleDensity: 0,
      animationSpeed: 0.5,
      gradientBackground: false,
      glassEffect: false,
      shadowIntensity: 0.1,
      borderRadius: 4
    },
    accessibility: {
      reduceMotion: true,
      highContrast: false,
      fontSize: 16,
      focusVisible: true,
      screenReaderOptimized: true
    },
    cssVariables: {}
  },
  'high-contrast': {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Maximum contrast for accessibility and clarity',
    colors: {
      primary: '#0000FF',
      secondary: '#000080',
      accent: '#FF00FF',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      surfaceSecondary: '#F0F0F0',
      text: '#000000',
      textSecondary: '#000000',
      textMuted: '#333333',
      border: '#000000',
      success: '#008000',
      warning: '#FF8000',
      error: '#FF0000',
      info: '#0000FF'
    },
    effects: {
      particlesEnabled: false,
      particleDensity: 0,
      animationSpeed: 0,
      gradientBackground: false,
      glassEffect: false,
      shadowIntensity: 0,
      borderRadius: 2
    },
    accessibility: {
      reduceMotion: true,
      highContrast: true,
      fontSize: 18,
      focusVisible: true,
      screenReaderOptimized: true
    },
    cssVariables: {}
  },
  'custom': {
    id: 'custom',
    name: 'Custom Theme',
    description: 'User-defined custom theme settings',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#C084FC',
      background: '#0F0F23',
      surface: '#1E1B3A',
      surfaceSecondary: '#2D2A4A',
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      border: '#374151',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    },
    effects: {
      particlesEnabled: true,
      particleDensity: 30,
      animationSpeed: 1,
      gradientBackground: true,
      glassEffect: true,
      shadowIntensity: 0.3,
      borderRadius: 12
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      fontSize: 16,
      focusVisible: true,
      screenReaderOptimized: true
    },
    cssVariables: {}
  }
}

// 🎨 Theme Context Interface
interface EnhancedThemeContextType {
  currentTheme: Theme
  themeId: ThemeId
  layoutSize: LayoutSize
  isTransitioning: boolean
  
  // Theme management
  setTheme: (themeId: ThemeId) => void
  updateTheme: (updates: Partial<Theme>) => void
  resetTheme: () => void
  
  // Layout management
  setLayoutSize: (size: LayoutSize) => void
  
  // Custom theme management
  saveCustomTheme: (theme: Partial<Theme>) => void
  loadCustomTheme: () => void
  
  // Accessibility helpers
  toggleReduceMotion: () => void
  toggleHighContrast: () => void
  adjustFontSize: (size: number) => void
  
  // Theme utilities
  generateCSSVariables: () => Record<string, string>
  exportTheme: () => string
  importTheme: (themeData: string) => boolean
}

// 🎨 Context Creation
const EnhancedThemeContext = createContext<EnhancedThemeContextType | undefined>(undefined)

// 🎨 Local Storage Keys
const STORAGE_KEYS = {
  THEME_ID: 'podplay-sanctuary-theme-id',
  LAYOUT_SIZE: 'podplay-sanctuary-layout-size',
  CUSTOM_THEME: 'podplay-sanctuary-custom-theme',
  ACCESSIBILITY: 'podplay-sanctuary-accessibility'
} as const

// 🎨 Enhanced Theme Provider Component
interface EnhancedThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemeId
  defaultLayoutSize?: LayoutSize
}

export function EnhancedThemeProvider({ 
  children, 
  defaultTheme = 'sanctuary-purple',
  defaultLayoutSize = 'comfortable'
}: EnhancedThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme)
  const [layoutSize, setLayoutSizeState] = useState<LayoutSize>(defaultLayoutSize)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[defaultTheme])

  // 🎨 Load saved preferences on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem(STORAGE_KEYS.THEME_ID) as ThemeId
    const savedLayoutSize = localStorage.getItem(STORAGE_KEYS.LAYOUT_SIZE) as LayoutSize
    const savedAccessibility = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY)

    if (savedThemeId && themes[savedThemeId]) {
      setThemeId(savedThemeId)
      setCurrentTheme(themes[savedThemeId])
    }

    if (savedLayoutSize) {
      setLayoutSizeState(savedLayoutSize)
    }

    if (savedAccessibility) {
      try {
        const accessibility = JSON.parse(savedAccessibility)
        setCurrentTheme(prev => ({
          ...prev,
          accessibility: { ...prev.accessibility, ...accessibility }
        }))
      } catch (error) {
        console.warn('Failed to parse saved accessibility settings:', error)
      }
    }
  }, [])

  // 🎨 Apply CSS variables when theme changes
  useEffect(() => {
    const cssVariables = generateCSSVariables()
    const root = document.documentElement

    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })

    // Apply accessibility settings to body
    document.body.style.fontSize = `${currentTheme.accessibility.fontSize}px`
    document.body.classList.toggle('reduce-motion', currentTheme.accessibility.reduceMotion)
    document.body.classList.toggle('high-contrast', currentTheme.accessibility.highContrast)
    document.body.classList.toggle('screen-reader-optimized', currentTheme.accessibility.screenReaderOptimized)

  }, [currentTheme])

  // 🎨 Theme management functions
  const setTheme = async (newThemeId: ThemeId) => {
    if (newThemeId === themeId) return

    setIsTransitioning(true)
    
    // Smooth transition effect
    await new Promise(resolve => setTimeout(resolve, 100))
    
    setThemeId(newThemeId)
    setCurrentTheme(themes[newThemeId])
    localStorage.setItem(STORAGE_KEYS.THEME_ID, newThemeId)
    
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const updateTheme = (updates: Partial<Theme>) => {
    setCurrentTheme(prev => {
      const updated = { ...prev, ...updates }
      if (themeId === 'custom') {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_THEME, JSON.stringify(updated))
      }
      return updated
    })
  }

  const resetTheme = () => {
    setCurrentTheme(themes[themeId])
    if (themeId === 'custom') {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_THEME)
    }
  }

  const setLayoutSize = (size: LayoutSize) => {
    setLayoutSizeState(size)
    localStorage.setItem(STORAGE_KEYS.LAYOUT_SIZE, size)
  }

  // 🎨 Custom theme management
  const saveCustomTheme = (themeUpdates: Partial<Theme>) => {
    const customTheme = { ...themes.custom, ...themeUpdates }
    themes.custom = customTheme
    localStorage.setItem(STORAGE_KEYS.CUSTOM_THEME, JSON.stringify(customTheme))
    
    if (themeId === 'custom') {
      setCurrentTheme(customTheme)
    }
  }

  const loadCustomTheme = () => {
    const savedCustomTheme = localStorage.getItem(STORAGE_KEYS.CUSTOM_THEME)
    if (savedCustomTheme) {
      try {
        const customTheme = JSON.parse(savedCustomTheme)
        themes.custom = { ...themes.custom, ...customTheme }
        if (themeId === 'custom') {
          setCurrentTheme(themes.custom)
        }
      } catch (error) {
        console.warn('Failed to load custom theme:', error)
      }
    }
  }

  // 🎨 Accessibility helpers
  const toggleReduceMotion = () => {
    updateTheme({
      accessibility: {
        ...currentTheme.accessibility,
        reduceMotion: !currentTheme.accessibility.reduceMotion
      }
    })
  }

  const toggleHighContrast = () => {
    updateTheme({
      accessibility: {
        ...currentTheme.accessibility,
        highContrast: !currentTheme.accessibility.highContrast
      }
    })
  }

  const adjustFontSize = (size: number) => {
    const clampedSize = Math.max(12, Math.min(24, size))
    updateTheme({
      accessibility: {
        ...currentTheme.accessibility,
        fontSize: clampedSize
      }
    })
  }

  // 🎨 CSS Variables Generation
  const generateCSSVariables = (): Record<string, string> => {
    const { colors, effects } = currentTheme
    
    return {
      '--color-primary': colors.primary,
      '--color-secondary': colors.secondary,
      '--color-accent': colors.accent,
      '--color-background': colors.background,
      '--color-surface': colors.surface,
      '--color-surface-secondary': colors.surfaceSecondary,
      '--color-text': colors.text,
      '--color-text-secondary': colors.textSecondary,
      '--color-text-muted': colors.textMuted,
      '--color-border': colors.border,
      '--color-success': colors.success,
      '--color-warning': colors.warning,
      '--color-error': colors.error,
      '--color-info': colors.info,
      '--effect-particles-density': effects.particleDensity.toString(),
      '--effect-animation-speed': effects.animationSpeed.toString(),
      '--effect-shadow-intensity': effects.shadowIntensity.toString(),
      '--effect-border-radius': `${effects.borderRadius}px`,
      '--layout-size': layoutSize,
      '--font-size-base': `${currentTheme.accessibility.fontSize}px`
    }
  }

  // 🎨 Theme import/export utilities
  const exportTheme = (): string => {
    return JSON.stringify({
      theme: currentTheme,
      layoutSize,
      timestamp: new Date().toISOString()
    }, null, 2)
  }

  const importTheme = (themeData: string): boolean => {
    try {
      const { theme, layoutSize: importedLayoutSize } = JSON.parse(themeData)
      
      if (theme && theme.id && theme.colors) {
        saveCustomTheme(theme)
        setTheme('custom')
        
        if (importedLayoutSize) {
          setLayoutSize(importedLayoutSize)
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.warn('Failed to import theme:', error)
      return false
    }
  }

  // 🎨 Context value
  const value: EnhancedThemeContextType = {
    currentTheme,
    themeId,
    layoutSize,
    isTransitioning,
    setTheme,
    updateTheme,
    resetTheme,
    setLayoutSize,
    saveCustomTheme,
    loadCustomTheme,
    toggleReduceMotion,
    toggleHighContrast,
    adjustFontSize,
    generateCSSVariables,
    exportTheme,
    importTheme
  }

  return (
    <EnhancedThemeContext.Provider value={value}>
      <AnimatePresence mode="wait">
        <motion.div
          key={themeId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`theme-${themeId} layout-${layoutSize}`}
          data-theme={themeId}
          data-layout={layoutSize}
          data-reduce-motion={currentTheme.accessibility.reduceMotion}
          data-high-contrast={currentTheme.accessibility.highContrast}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </EnhancedThemeContext.Provider>
  )
}

// 🎨 Custom Hook for Using Enhanced Theme
export function useEnhancedTheme() {
  const context = useContext(EnhancedThemeContext)
  
  if (context === undefined) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider')
  }
  
  return context
}

// 🎨 Theme Utilities Export
export default EnhancedThemeContext
