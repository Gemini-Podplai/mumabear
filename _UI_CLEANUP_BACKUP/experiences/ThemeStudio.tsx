import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, CheckCircle, Settings, Download, Upload, Share2,
  Sun, Moon, Monitor, Brush, Sparkles, Eye, Zap, Layers,
  Contrast, Volume2, Accessibility, Globe, Smartphone, Tablet
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface ThemeVariant {
  id: string
  name: string
  description: string
  category: 'sanctuary' | 'professional' | 'creative' | 'accessibility' | 'seasonal'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    border: string
  }
  effects: {
    animations: boolean
    particles: boolean
    gradients: boolean
    shadows: boolean
  }
  accessibility: {
    highContrast: boolean
    reducedMotion: boolean
    largeText: boolean
    colorBlindFriendly: boolean
  }
  created: string
  author: string
  downloads: number
  rating: number
  preview?: string
}

const THEME_VARIANTS: ThemeVariant[] = [
  {
    id: 'sanctuary',
    name: 'Sanctuary Forest',
    description: 'Calming forest greens with nature-inspired gradients and gentle animations',
    category: 'sanctuary',
    colors: {
      primary: 'linear-gradient(135deg, #2D5A3D 0%, #4A7C59 100%)',
      secondary: 'linear-gradient(135deg, #5D8A6B 0%, #7BA185 100%)',
      accent: 'linear-gradient(135deg, #8FBC8F 0%, #98FB98 100%)',
      background: '#F8FDF9',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#2C3E2F',
      border: '#E8F5E8'
    },
    effects: { animations: true, particles: true, gradients: true, shadows: true },
    accessibility: { highContrast: false, reducedMotion: false, largeText: false, colorBlindFriendly: true },
    created: '2024-10-15',
    author: 'Sanctuary Team',
    downloads: 1247,
    rating: 4.9
  },
  {
    id: 'cosmic_purple',
    name: 'Cosmic Purple',
    description: 'Deep space purples with nebula-inspired gradients and stellar effects',
    category: 'creative',
    colors: {
      primary: 'linear-gradient(135deg, #1A0033 0%, #330066 100%)',
      secondary: 'linear-gradient(135deg, #4B0082 0%, #663399 100%)',
      accent: 'linear-gradient(135deg, #9932CC 0%, #DA70D6 100%)',
      background: 'linear-gradient(135deg, #0A0015 0%, #1A0033 50%, #2D1B47 100%)',
      surface: 'rgba(75, 0, 130, 0.2)',
      text: '#DDA0DD',
      border: '#4B0082'
    },
    effects: { animations: true, particles: true, gradients: true, shadows: true },
    accessibility: { highContrast: false, reducedMotion: false, largeText: false, colorBlindFriendly: false },
    created: '2024-09-28',
    author: 'Design Team',
    downloads: 892,
    rating: 4.7
  },
  {
    id: 'professional_blue',
    name: 'Professional Blue',
    description: 'Clean, corporate blue theme optimized for productivity and focus',
    category: 'professional',
    colors: {
      primary: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
      secondary: 'linear-gradient(135deg, #60A5FA 0%, #93C5FD 100%)',
      accent: 'linear-gradient(135deg, #DBEAFE 0%, #F0F9FF 100%)',
      background: '#FFFFFF',
      surface: 'rgba(249, 250, 251, 0.9)',
      text: '#1F2937',
      border: '#E5E7EB'
    },
    effects: { animations: false, particles: false, gradients: false, shadows: true },
    accessibility: { highContrast: true, reducedMotion: true, largeText: false, colorBlindFriendly: true },
    created: '2024-11-01',
    author: 'Pro Team',
    downloads: 2156,
    rating: 4.8
  },
  {
    id: 'sunset_orange',
    name: 'Sunset Orange',
    description: 'Warm sunset colors with energizing orange and red gradients',
    category: 'creative',
    colors: {
      primary: 'linear-gradient(135deg, #EA580C 0%, #FB923C 100%)',
      secondary: 'linear-gradient(135deg, #FDBA74 0%, #FED7AA 100%)',
      accent: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
      background: '#FFFBF5',
      surface: 'rgba(255, 251, 245, 0.9)',
      text: '#9A3412',
      border: '#FDBA74'
    },
    effects: { animations: true, particles: false, gradients: true, shadows: true },
    accessibility: { highContrast: false, reducedMotion: false, largeText: false, colorBlindFriendly: true },
    created: '2024-10-20',
    author: 'Creative Team',
    downloads: 634,
    rating: 4.6
  },
  {
    id: 'high_contrast',
    name: 'High Contrast',
    description: 'Maximum contrast theme optimized for accessibility and visual clarity',
    category: 'accessibility',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      background: '#FFFFFF',
      surface: '#F9F9F9',
      text: '#000000',
      border: '#000000'
    },
    effects: { animations: false, particles: false, gradients: false, shadows: false },
    accessibility: { highContrast: true, reducedMotion: true, largeText: true, colorBlindFriendly: true },
    created: '2024-08-15',
    author: 'Accessibility Team',
    downloads: 445,
    rating: 4.9
  }
]

const ThemeCard: React.FC<{ 
  theme: ThemeVariant
  isActive: boolean
  onSelect: () => void
  onCustomize: () => void
}> = ({ theme, isActive, onSelect, onCustomize }) => {
  return (
    <Card className={cn(
      "cursor-pointer transition-all duration-200 hover:shadow-lg group",
      isActive && "ring-2 ring-primary shadow-lg"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{theme.name}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {theme.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {theme.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Color Preview */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Color Palette</Label>
          <div className="grid grid-cols-4 gap-2">
            <div 
              className="h-8 rounded"
              style={{ background: theme.colors.primary }}
              title="Primary"
            />
            <div 
              className="h-8 rounded"
              style={{ background: theme.colors.secondary }}
              title="Secondary"
            />
            <div 
              className="h-8 rounded"
              style={{ background: theme.colors.accent }}
              title="Accent"
            />
            <div 
              className="h-8 rounded border"
              style={{ background: theme.colors.background }}
              title="Background"
            />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Features</Label>
          <div className="flex flex-wrap gap-1">
            {theme.effects.animations && <Badge variant="outline" className="text-xs">Animations</Badge>}
            {theme.effects.particles && <Badge variant="outline" className="text-xs">Particles</Badge>}
            {theme.effects.gradients && <Badge variant="outline" className="text-xs">Gradients</Badge>}
            {theme.accessibility.highContrast && <Badge variant="outline" className="text-xs">High Contrast</Badge>}
            {theme.accessibility.colorBlindFriendly && <Badge variant="outline" className="text-xs">Color Blind Friendly</Badge>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
          <div className="text-center">
            <div className="text-sm font-bold text-primary">{theme.rating}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-primary">{theme.downloads}</div>
            <div className="text-xs text-muted-foreground">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-primary">{theme.author}</div>
            <div className="text-xs text-muted-foreground">Author</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            onClick={onSelect}
            className={cn("flex-1", isActive && "bg-primary")}
          >
            {isActive ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </>
            ) : (
              'Apply'
            )}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onCustomize}
          >
            <Settings className="h-3 w-3 mr-1" />
            Customize
          </Button>
        </div>

        {/* Preview Badge */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 right-2"
          >
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

const ThemeCustomizer: React.FC<{ 
  theme: ThemeVariant | null
  onSave: (theme: ThemeVariant) => void
  onClose: () => void
}> = ({ theme, onSave, onClose }) => {
  const [customTheme, setCustomTheme] = useState<ThemeVariant | null>(theme)

  if (!customTheme) return null

  const updateTheme = (path: string, value: any) => {
    setCustomTheme(prev => {
      if (!prev) return null
      const keys = path.split('.')
      const updated = { ...prev }
      let current: any = updated
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return updated
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Customize {customTheme.name}</h2>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <Tabs defaultValue="colors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(customTheme.colors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-12 h-10 rounded border"
                      style={{ background: value }}
                    />
                    <input
                      type="color"
                      value={typeof value === 'string' && value.startsWith('#') ? value : '#000000'}
                      onChange={(e) => updateTheme(`colors.${key}`, e.target.value)}
                      className="flex-1 h-10 rounded border"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            {Object.entries(customTheme.effects).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateTheme(`effects.${key}`, checked)}
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4">
            {Object.entries(customTheme.accessibility).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateTheme(`accessibility.${key}`, checked)}
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={() => onSave(customTheme)} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Theme
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ThemeStudio: React.FC = () => {
  const [themes, setThemes] = useState<ThemeVariant[]>(THEME_VARIANTS)
  const [activeTheme, setActiveTheme] = useState<string>('sanctuary')
  const [customizing, setCustomizing] = useState<ThemeVariant | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleThemeSelect = (themeId: string) => {
    setActiveTheme(themeId)
    // Apply theme logic here
  }

  const handleThemeCustomize = (theme: ThemeVariant) => {
    setCustomizing(theme)
  }

  const handleSaveCustomTheme = (theme: ThemeVariant) => {
    const newTheme = {
      ...theme,
      id: `custom_${Date.now()}`,
      author: 'You',
      created: new Date().toISOString().split('T')[0],
      downloads: 0,
      rating: 0
    }
    setThemes(prev => [...prev, newTheme])
    setCustomizing(null)
    setActiveTheme(newTheme.id)
  }

  const filteredThemes = themes.filter(theme => {
    const matchesFilter = filter === 'all' || theme.category === filter
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const categoryCounts = {
    all: themes.length,
    sanctuary: themes.filter(t => t.category === 'sanctuary').length,
    professional: themes.filter(t => t.category === 'professional').length,
    creative: themes.filter(t => t.category === 'creative').length,
    accessibility: themes.filter(t => t.category === 'accessibility').length,
    seasonal: themes.filter(t => t.category === 'seasonal').length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme Studio</h1>
          <p className="text-muted-foreground mt-1">
            Customize your Sanctuary experience with beautiful themes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Brush className="h-4 w-4 mr-2" />
            Create Theme
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {Object.entries(categoryCounts).map(([category, count]) => (
          <Card 
            key={category} 
            className={cn(
              "cursor-pointer transition-colors hover:bg-muted/50",
              filter === category && "ring-2 ring-primary"
            )}
            onClick={() => setFilter(category)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{count}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {category}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search themes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="sanctuary">Sanctuary</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
            <SelectItem value="accessibility">Accessibility</SelectItem>
            <SelectItem value="seasonal">Seasonal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={activeTheme === theme.id}
            onSelect={() => handleThemeSelect(theme.id)}
            onCustomize={() => handleThemeCustomize(theme)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredThemes.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No themes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or create a new theme
          </p>
        </div>
      )}

      {/* Theme Customizer Modal */}
      <AnimatePresence>
        {customizing && (
          <ThemeCustomizer
            theme={customizing}
            onSave={handleSaveCustomTheme}
            onClose={() => setCustomizing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeStudio
