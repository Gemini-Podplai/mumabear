import React, { createContext, useContext, useEffect, useState } from 'react'

interface Theme {
    type: 'light' | 'dark'
    colors: {
        primary: string
        background: string
        text: string
        border: string
    }
}

interface ThemeContextType {
    currentTheme: Theme
    setTheme: (type: 'light' | 'dark') => void
}

const lightTheme: Theme = {
    type: 'light',
    colors: {
        primary: '#006ADC',
        background: '#FFFFFF',
        text: '#000000',
        border: '#E5E7EB'
    }
}

const darkTheme: Theme = {
    type: 'dark',
    colors: {
        primary: '#60A5FA',
        background: '#1A1B1E',
        text: '#FFFFFF',
        border: '#2D2E32'
    }
}

const ThemeContext = createContext<ThemeContextType>({
    currentTheme: lightTheme,
    setTheme: () => { }
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        // Check system preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(isDark ? 'dark' : 'light')

        // Listen for system changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? 'dark' : 'light')
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const value = {
        currentTheme: theme === 'dark' ? darkTheme : lightTheme,
        setTheme
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
