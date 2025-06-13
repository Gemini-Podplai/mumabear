import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, 
  Monitor, 
  Moon, 
  Sun, 
  Sparkles, 
  Waves,
  Zap,
  Eye,
  Volume2,
  Type,
  Contrast,
  Settings,
  Check,
  Download,
  Upload,
  RotateCcw,
  ChevronDown,
  Accessibility,
  Layout,
  Maximize,
  Minimize,
  Square
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useEnhancedTheme, themes, ThemeId, LayoutSize } from '@/contexts/EnhancedThemeContext'
import { cn } from '@/lib/utils'

// 🎨 Theme Icon Components
const getThemeIcon = (themeId: ThemeId) => {
  const iconMap = {
    'sanctuary-purple': Sparkles,
    'dark': Moon,
    'light': Sun,
    'neon': Zap,
    'forest': () => <span className="text-green-500">🌲</span>,
    'ocean': Waves,
    'cyberpunk': () => <span className="text-green-400">⚡</span>,
    'minimal': Square,
    'high-contrast': Contrast,
    'custom': Settings
  }
  
  const IconComponent = iconMap[themeId] || Settings
  return typeof IconComponent === 'function' && IconComponent.name ? <IconComponent className="w-4 h-4" /> : <IconComponent />
}

// 🎨 Theme Preview Component
interface ThemePreviewProps {
  themeId: ThemeId
  isActive: boolean
  onClick: () => void
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ themeId, isActive, onClick }) => {
  const theme = themes[themeId]
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative p-3 rounded-lg border-2 cursor-pointer transition-all",
        isActive 
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      )}
      onClick={onClick}
      data-testid={`theme-${themeId}`}
      data-active={isActive}
    >
      {/* Theme Color Preview */}
      <div className="flex gap-1 mb-2">
        <div 
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div 
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: theme.colors.secondary }}
        />
        <div 
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: theme.colors.accent }}
        />
        <div 
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: theme.colors.background }}
        />
      </div>
      
      {/* Theme Info */}
      <div className="flex items-center gap-2 mb-1">
        {getThemeIcon(themeId)}
        <span className="font-medium text-sm">{theme.name}</span>
        {isActive && <Check className="w-4 h-4 text-green-500 ml-auto" />}
      </div>
      
      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
        {theme.description}
      </p>
      
      {/* Effects Indicators */}
      <div className="flex gap-1 mt-2">
        {theme.effects.particlesEnabled && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            ✨ Effects
          </Badge>
        )}
        {theme.effects.glassEffect && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            🔮 Glass
          </Badge>
        )}
        {theme.accessibility.highContrast && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            👁️ A11y
          </Badge>
        )}
      </div>
    </motion.div>
  )
}

// 🎨 Layout Size Selector Component
const LayoutSizeSelector: React.FC = () => {
  const { layoutSize, setLayoutSize } = useEnhancedTheme()
  
  const layoutOptions = [
    { id: 'compact' as LayoutSize, name: 'Compact', icon: Minimize, description: 'Minimal spacing for coding' },
    { id: 'comfortable' as LayoutSize, name: 'Comfortable', icon: Square, description: 'Balanced layout' },
    { id: 'spacious' as LayoutSize, name: 'Spacious', icon: Maximize, description: 'Extra space for reading' }
  ]
  
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Layout Size</Label>
      <div className="grid grid-cols-3 gap-2">
        {layoutOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <Button
              key={option.id}
              variant={layoutSize === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => setLayoutSize(option.id)}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-xs">{option.name}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

// 🎨 Accessibility Controls Component
const AccessibilityControls: React.FC = () => {
  const { 
    currentTheme, 
    toggleReduceMotion, 
    toggleHighContrast, 
    adjustFontSize 
  } = useEnhancedTheme()
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Reduce Motion</Label>
        <Switch
          checked={currentTheme.accessibility.reduceMotion}
          onCheckedChange={toggleReduceMotion}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">High Contrast</Label>
        <Switch
          checked={currentTheme.accessibility.highContrast}
          onCheckedChange={toggleHighContrast}
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Font Size: {currentTheme.accessibility.fontSize}px
        </Label>
        <Slider
          value={[currentTheme.accessibility.fontSize]}
          onValueChange={([value]) => adjustFontSize(value)}
          min={12}
          max={24}
          step={1}
          className="w-full"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Screen Reader Optimized</Label>
        <Switch
          checked={currentTheme.accessibility.screenReaderOptimized}
          onCheckedChange={() => {/* Implementation needed */}}
        />
      </div>
    </div>
  )
}

// 🎨 Effects Controls Component
const EffectsControls: React.FC = () => {
  const { currentTheme, updateTheme } = useEnhancedTheme()
  
  const updateEffects = (key: keyof typeof currentTheme.effects, value: any) => {
    updateTheme({
      effects: {
        ...currentTheme.effects,
        [key]: value
      }
    })
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Particle Effects</Label>
        <Switch
          checked={currentTheme.effects.particlesEnabled}
          onCheckedChange={(checked) => updateEffects('particlesEnabled', checked)}
        />
      </div>
      
      {currentTheme.effects.particlesEnabled && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Particle Density: {currentTheme.effects.particleDensity}
          </Label>
          <Slider
            value={[currentTheme.effects.particleDensity]}
            onValueChange={([value]) => updateEffects('particleDensity', value)}
            min={10}
            max={100}
            step={5}
            className="w-full"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Animation Speed: {currentTheme.effects.animationSpeed}x
        </Label>
        <Slider
          value={[currentTheme.effects.animationSpeed]}
          onValueChange={([value]) => updateEffects('animationSpeed', value)}
          min={0}
          max={3}
          step={0.1}
          className="w-full"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Glass Effect</Label>
        <Switch
          checked={currentTheme.effects.glassEffect}
          onCheckedChange={(checked) => updateEffects('glassEffect', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Gradient Background</Label>
        <Switch
          checked={currentTheme.effects.gradientBackground}
          onCheckedChange={(checked) => updateEffects('gradientBackground', checked)}
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Shadow Intensity: {Math.round(currentTheme.effects.shadowIntensity * 100)}%
        </Label>
        <Slider
          value={[currentTheme.effects.shadowIntensity]}
          onValueChange={([value]) => updateEffects('shadowIntensity', value)}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Border Radius: {currentTheme.effects.borderRadius}px
        </Label>
        <Slider
          value={[currentTheme.effects.borderRadius]}
          onValueChange={([value]) => updateEffects('borderRadius', value)}
          min={0}
          max={24}
          step={2}
          className="w-full"
        />
      </div>
    </div>
  )
}

// 🎨 Theme Import/Export Component
const ThemeImportExport: React.FC = () => {
  const { exportTheme, importTheme, resetTheme } = useEnhancedTheme()
  const [importData, setImportData] = useState('')
  const [exportData, setExportData] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleExport = () => {
    const data = exportTheme()
    setExportData(data)
    
    // Download as file
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `podplay-theme-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const handleImport = () => {
    if (importData.trim()) {
      const success = importTheme(importData)
      if (success) {
        setImportData('')
        alert('Theme imported successfully!')
      } else {
        alert('Failed to import theme. Please check the format.')
      }
    }
  }
  
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setImportData(content)
      }
      reader.readAsText(file)
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Import File
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Import Theme Data</Label>
        <Textarea
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          placeholder="Paste theme JSON data here..."
          className="min-h-[100px]"
        />
        {importData.trim() && (
          <Button onClick={handleImport} size="sm" className="w-full">
            Import Theme
          </Button>
        )}
      </div>
      
      {exportData && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Exported Theme Data</Label>
          <Textarea
            value={exportData}
            readOnly
            className="min-h-[100px] text-xs"
          />
        </div>
      )}
      
      <Separator />
      
      <Button onClick={resetTheme} variant="destructive" size="sm" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset to Default
      </Button>
    </div>
  )
}

// 🎨 Main Enhanced Theme Switcher Component
interface EnhancedThemeSwitcherProps {
  className?: string
  compact?: boolean
}

export const EnhancedThemeSwitcher: React.FC<EnhancedThemeSwitcherProps> = ({ 
  className,
  compact = false 
}) => {
  const { themeId, setTheme, isTransitioning } = useEnhancedTheme()
  const [isOpen, setIsOpen] = useState(false)
  
  if (compact) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={cn("gap-2", className)}
            disabled={isTransitioning}
            data-testid="theme-switcher-button"
          >
            {getThemeIcon(themeId)}
            {themes[themeId].name}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden" data-testid="theme-switcher-panel">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme Customization Hub
            </DialogTitle>
            <DialogDescription>
              Customize your Podplay Sanctuary experience with themes, layouts, and accessibility options.
            </DialogDescription>
          </DialogHeader>
          <EnhancedThemeSwitcherContent />
        </DialogContent>
      </Dialog>
    )
  }
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Theme Hub
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedThemeSwitcherContent />
      </CardContent>
    </Card>
  )
}

// 🎨 Theme Switcher Content Component
const EnhancedThemeSwitcherContent: React.FC = () => {
  const { themeId, setTheme, isTransitioning } = useEnhancedTheme()
  
  return (
    <Tabs defaultValue="themes" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="themes" data-testid="themes-tab">Themes</TabsTrigger>
        <TabsTrigger value="layout" data-testid="layout-tab">Layout</TabsTrigger>
        <TabsTrigger value="effects" data-testid="effects-tab">Effects</TabsTrigger>
        <TabsTrigger value="accessibility" data-testid="accessibility-tab">Access</TabsTrigger>
      </TabsList>
      
      <TabsContent value="themes" className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(themes).map(([id, theme]) => (
              <ThemePreview
                key={id}
                themeId={id as ThemeId}
                isActive={themeId === id}
                onClick={() => setTheme(id as ThemeId)}
              />
            ))}
          </div>
        </ScrollArea>
        
        {isTransitioning && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-600">Applying theme...</span>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="layout" className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <LayoutSizeSelector />
          <Separator className="my-4" />
          <ThemeImportExport />
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="effects" className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <EffectsControls />
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="accessibility" className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <AccessibilityControls />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}

export default EnhancedThemeSwitcher
