import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain } from 'lucide-react'
import { useSanctuaryStore } from '@/stores/sanctuaryStore'
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext'
import EnhancedSanctuaryNav from './EnhancedSanctuaryNav'
import AuroraBackground from '../effects/AuroraBackground'
import { AnimatedBackground } from '../effects/AnimatedBackground'
import UniversalMamaBearWidget from '../specialized/UniversalMamaBearWidget'
import { EnhancedThemeSwitcher } from '../theme/EnhancedThemeSwitcher'

interface SanctuaryLayoutProps {
  children: React.ReactNode
}

export default function SanctuaryLayout({ children }: SanctuaryLayoutProps) {
  const {
    isSidebarOpen,
    effectLevel,
    theme,
    toggleSidebar
  } = useSanctuaryStore()

  const { currentTheme } = useEnhancedTheme()
  const [mouseNearSidebar, setMouseNearSidebar] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mamaBearVisible, setMamaBearVisible] = useState(true)

  // Auto-hide sidebar logic - Simplified for existing store
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isNearLeft = e.clientX < 80
      setMouseNearSidebar(isNearLeft)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const layoutVariants = {
    expanded: {
      marginLeft: 280,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    },
    collapsed: {
      marginLeft: 80,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    }
  }

  const containerClass = `
    min-h-screen relative overflow-hidden
    ${effectLevel === 'full' ? 'splash-cursor' : ''}
    theme-${theme}
  `.trim()

  return (
    <div className={containerClass}>
      {/* Enhanced Background Effects */}
      <AnimatedBackground className="absolute inset-0 z-0">
        {/* Legacy Aurora Background for compatibility */}
        {effectLevel === 'full' && !currentTheme.effects.particlesEnabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
          >
            <AuroraBackground>
              <div className="absolute inset-0" />
            </AuroraBackground>
          </motion.div>
        )}
      </AnimatedBackground>

      {/* Cursor Effects - Temporarily disabled for performance */}
      {/* {effectLevel === 'full' && <SplashCursor />} */}

      {/* Navigation Sidebar */}
      <motion.div
        className="fixed left-0 top-0 h-full z-30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={isSidebarOpen ? 'expanded' : 'collapsed'}
        variants={{
          expanded: { x: 0 },
          collapsed: { x: 0 }
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <EnhancedSanctuaryNav />
      </motion.div>

      {/* Main Content Area */}
      <motion.main
        className="relative z-10"
        animate={isSidebarOpen ? 'expanded' : 'collapsed'}
        variants={layoutVariants}
        style={{
          minHeight: '100vh',
          background: effectLevel === 'none' 
            ? 'var(--color-background)' 
            : 'transparent'
        }}
      >
        {/* Glass Content Container */}
        <motion.div
          className={`
            min-h-screen
            ${effectLevel !== 'none' ? 'glass' : 'bg-background'}
            ${effectLevel === 'full' ? 'backdrop-blur-xl' : ''}
          `.trim()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </motion.main>

      {/* Persistent Mama Bear Icon */}
      <AnimatePresence>
        {!mamaBearVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              onClick={() => setMamaBearVisible(true)}
              className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mama Bear Widget */}
      <AnimatePresence>
        {mamaBearVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-40"
          >
            <UniversalMamaBearWidget />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Theme Switcher */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <EnhancedThemeSwitcher compact={true} />
      </motion.div>

      {/* Ambient Particles - Reduced for performance */}
      {effectLevel === 'full' && (
        <div className="fixed inset-0 pointer-events-none z-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-500 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 6 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Performance Overlay for Debugging */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="fixed bottom-4 left-4 z-50 glass p-3 rounded-lg text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div>Theme: {currentTheme.name} ({currentTheme.id})</div>
          <div>Layout: {currentTheme ? 'Enhanced' : 'Legacy'}</div>
          <div>Effects: {effectLevel}</div>
          <div>Particles: {currentTheme.effects.particlesEnabled ? 'On' : 'Off'}</div>
          <div>Sidebar: {isSidebarOpen ? 'open' : 'closed'}</div>
        </motion.div>
      )}
    </div>
  )
}