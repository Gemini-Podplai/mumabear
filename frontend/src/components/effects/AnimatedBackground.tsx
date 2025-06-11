import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext'

// 🎨 Particle System Types
interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

interface ParticleSystemProps {
  className?: string
  style?: React.CSSProperties
}

// 🎨 Enhanced Particle System Component
export const EnhancedParticleSystem: React.FC<ParticleSystemProps> = ({ 
  className = "",
  style = {}
}) => {
  const { currentTheme } = useEnhancedTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(true)

  // 🎨 Particle Creation
  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const colors = [
      currentTheme.colors.primary,
      currentTheme.colors.secondary,
      currentTheme.colors.accent
    ]
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2 * currentTheme.effects.animationSpeed,
      vy: (Math.random() - 0.5) * 2 * currentTheme.effects.animationSpeed,
      radius: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 1000 + 500
    }
  }, [currentTheme])

  // 🎨 Canvas Animation Loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !isActive || !currentTheme.effects.particlesEnabled) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas with fade effect
    ctx.fillStyle = `${currentTheme.colors.background}08`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      // Update particle position
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life += 1

      // Bounce off walls
      if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1
      if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1

      // Mouse interaction
      const dx = mouseRef.current.x - particle.x
      const dy = mouseRef.current.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100) {
        const force = (100 - distance) / 100 * 0.5
        particle.vx += (dx / distance) * force * 0.1
        particle.vy += (dy / distance) * force * 0.1
      }

      // Apply velocity damping
      particle.vx *= 0.99
      particle.vy *= 0.99

      // Update opacity based on life
      const lifeRatio = particle.life / particle.maxLife
      particle.opacity = Math.max(0, 1 - lifeRatio)

      // Draw particle
      if (particle.opacity > 0) {
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
        
        // Add glow effect for neon theme
        if (currentTheme.id === 'neon' || currentTheme.id === 'cyberpunk') {
          ctx.shadowColor = particle.color
          ctx.shadowBlur = 10
          ctx.fill()
        }
        
        ctx.restore()
      }

      // Remove dead particles
      if (particle.life >= particle.maxLife) {
        particlesRef.current.splice(index, 1)
      }
    })

    // Draw connections between nearby particles
    if (currentTheme.effects.particleDensity > 20) {
      ctx.strokeStyle = `${currentTheme.colors.primary}20`
      ctx.lineWidth = 1

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.globalAlpha = (150 - distance) / 150 * 0.3
            ctx.stroke()
          }
        }
      }
    }

    // Add new particles if needed
    const targetParticleCount = Math.floor(currentTheme.effects.particleDensity)
    while (particlesRef.current.length < targetParticleCount) {
      particlesRef.current.push(createParticle(canvas))
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [currentTheme, isActive, createParticle])

  // 🎨 Canvas Setup and Event Handlers
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
    }

    const handleVisibilityChange = () => {
      setIsActive(!document.hidden)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    canvas.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Initialize particles
    const targetParticleCount = Math.floor(currentTheme.effects.particleDensity)
    particlesRef.current = []
    for (let i = 0; i < targetParticleCount; i++) {
      particlesRef.current.push(createParticle(canvas))
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationRef.current)
    }
  }, [currentTheme.effects.particleDensity, createParticle, animate])

  // 🎨 Accessibility: Disable if reduced motion is preferred
  useEffect(() => {
    if (currentTheme.accessibility.reduceMotion) {
      setIsActive(false)
      particlesRef.current = []
    } else {
      setIsActive(true)
    }
  }, [currentTheme.accessibility.reduceMotion])

  if (!currentTheme.effects.particlesEnabled || currentTheme.accessibility.reduceMotion) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        opacity: 0.6,
        zIndex: -1,
        ...style
      }}
    />
  )
}

// 🎨 Gradient Background Component
interface GradientBackgroundProps {
  className?: string
}

export const EnhancedGradientBackground: React.FC<GradientBackgroundProps> = ({ 
  className = "" 
}) => {
  const { currentTheme } = useEnhancedTheme()
  
  if (!currentTheme.effects.gradientBackground) {
    return null
  }

  const gradientStyle = {
    background: `linear-gradient(135deg, 
      ${currentTheme.colors.background} 0%, 
      ${currentTheme.colors.surface} 50%, 
      ${currentTheme.colors.surfaceSecondary} 100%)`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={gradientStyle}
    />
  )
}

// 🎨 Floating Elements Component
interface FloatingElement {
  id: string
  x: number
  y: number
  size: number
  rotation: number
  speed: number
  symbol: string
  color: string
}

export const FloatingElements: React.FC = () => {
  const { currentTheme } = useEnhancedTheme()
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    if (!currentTheme.effects.particlesEnabled || currentTheme.accessibility.reduceMotion) {
      setElements([])
      return
    }

    const symbols = currentTheme.id === 'cyberpunk' 
      ? ['0', '1', '〉', '〈', '∞', '△', '○', '◇']
      : currentTheme.id === 'forest'
      ? ['🌿', '🍃', '🌱', '🦋', '✨']
      : currentTheme.id === 'ocean'
      ? ['🌊', '💧', '🐠', '⭐', '🌙']
      : ['✨', '⭐', '💫', '🌟', '✦']

    const newElements: FloatingElement[] = Array.from({ length: 8 }, (_, i) => ({
      id: `floating-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      rotation: Math.random() * 360,
      speed: Math.random() * 20 + 10,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      color: [
        currentTheme.colors.primary,
        currentTheme.colors.secondary,
        currentTheme.colors.accent
      ][Math.floor(Math.random() * 3)]
    }))

    setElements(newElements)
  }, [currentTheme])

  if (!currentTheme.effects.particlesEnabled || currentTheme.accessibility.reduceMotion) {
    return null
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <AnimatePresence>
        {elements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute text-2xl"
            initial={{ 
              x: `${element.x}%`, 
              y: `${element.y}%`,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              x: [`${element.x}%`, `${(element.x + 20) % 100}%`],
              y: [`${element.y}%`, `${(element.y + 30) % 100}%`],
              rotate: [element.rotation, element.rotation + 360],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: element.speed * currentTheme.effects.animationSpeed,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ 
              color: element.color,
              fontSize: `${element.size}px`,
              filter: currentTheme.id === 'neon' ? 'drop-shadow(0 0 10px currentColor)' : 'none'
            }}
          >
            {element.symbol}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// 🎨 Glass Effect Overlay Component
interface GlassEffectProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export const GlassEffect: React.FC<GlassEffectProps> = ({ 
  children, 
  className = "",
  intensity = 1
}) => {
  const { currentTheme } = useEnhancedTheme()
  
  if (!currentTheme.effects.glassEffect) {
    return <div className={className}>{children}</div>
  }

  const glassStyle = {
    background: `rgba(255, 255, 255, ${0.1 * intensity})`,
    backdropFilter: `blur(${10 * intensity}px)`,
    border: `1px solid rgba(255, 255, 255, ${0.2 * intensity})`,
    borderRadius: currentTheme.effects.borderRadius
  }

  return (
    <motion.div
      className={`glass-effect ${className}`}
      style={glassStyle}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// 🎨 Animated Background Component (combines all effects)
interface AnimatedBackgroundProps {
  className?: string
  children?: React.ReactNode
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  className = "",
  children
}) => {
  const { currentTheme } = useEnhancedTheme()

  return (
    <div className={`relative w-full h-full ${className}`} data-testid="animated-background">
      {/* Gradient Background Layer */}
      <EnhancedGradientBackground />
      
      {/* Particle System Layer */}
      <EnhancedParticleSystem />
      
      {/* Floating Elements Layer */}
      <FloatingElements />
      
      {/* Content Layer */}
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  )
}

// 🎨 Theme Transition Component
interface ThemeTransitionProps {
  children: React.ReactNode
}

export const ThemeTransition: React.FC<ThemeTransitionProps> = ({ children }) => {
  const { themeId, isTransitioning } = useEnhancedTheme()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={themeId}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ 
          duration: 0.5,
          ease: "easeInOut"
        }}
        className="w-full h-full"
      >
        {children}
        
        {/* Transition Overlay */}
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimatedBackground
