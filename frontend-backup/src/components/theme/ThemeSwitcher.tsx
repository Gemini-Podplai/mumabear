import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Settings, 
  Eye, 
  ChevronDown, 
  Check,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Accessibility,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnhancedTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

// Quick Theme Switcher (for header/toolbar)
export const QuickThemeSwitcher: React.FC = () => {
  const { currentTheme, availableThemes, setTheme, previewTheme, exitPreview, isPreviewMode } = useEnhancedTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const handlePreview = (themeId: string) => {
    if (themeId === currentTheme.id) {
      exitPreview();
    } else {
      previewTheme(themeId);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{currentTheme.name}</span>
        {isPreviewMode && <Badge variant="secondary" className="text-xs">Preview</Badge>}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Quick Theme Switch</h3>
                {isPreviewMode && (
                  <Button size="sm" variant="outline" onClick={exitPreview}>
                    Exit Preview
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {availableThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      "hover:bg-accent/50",
                      currentTheme.id === theme.id && "bg-accent"
                    )}
                    onClick={() => handleThemeSelect(theme.id)}
                    onMouseEnter={() => handlePreview(theme.id)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ background: theme.colors.primary }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{theme.name}</div>
                      <div className="text-xs text-muted-foreground">{theme.description}</div>
                    </div>
                    {currentTheme.id === theme.id && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Theme Test Panel (for development/testing)
export const ThemeTestPanel: React.FC = () => {
  const { 
    currentTheme, 
    themePreferences, 
    updateAccessibility, 
    updateAnimations,
    availableThemes,
    setTheme,
    cssVariables
  } = useEnhancedTheme();

  const [showCssVars, setShowCssVars] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Test Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Theme Info */}
          <div className="space-y-2">
            <Label>Current Theme</Label>
            <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
              <div 
                className="w-8 h-8 rounded-full border-2 border-white shadow"
                style={{ background: currentTheme.colors.primary }}
              />
              <div>
                <div className="font-semibold">{currentTheme.name}</div>
                <div className="text-sm text-muted-foreground">{currentTheme.description}</div>
              </div>
              <Badge variant="outline">{currentTheme.category}</Badge>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <Label>Switch Theme</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableThemes.slice(0, 6).map((theme) => (
                <Button
                  key={theme.id}
                  variant={currentTheme.id === theme.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(theme.id)}
                  className="justify-start"
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ background: theme.colors.primary }}
                  />
                  {theme.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Accessibility Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              <Label>Accessibility Settings</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">High Contrast</Label>
                  <Switch
                    checked={themePreferences.accessibility.highContrast}
                    onCheckedChange={(checked) => updateAccessibility({ highContrast: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Reduced Motion</Label>
                  <Switch
                    checked={themePreferences.accessibility.reducedMotion}
                    onCheckedChange={(checked) => updateAccessibility({ reducedMotion: checked })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Font Size</Label>
                <Select
                  value={themePreferences.accessibility.fontSize}
                  onValueChange={(value: any) => updateAccessibility({ fontSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Animation Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <Label>Animation Settings</Label>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Enable Animations</Label>
                <Switch
                  checked={themePreferences.animations.enabled}
                  onCheckedChange={(enabled) => updateAnimations({ enabled })}
                />
              </div>
              
              {themePreferences.animations.enabled && (
                <div className="space-y-2">
                  <Label className="text-sm">Animation Speed: {themePreferences.animations.speed}x</Label>
                  <Slider
                    value={[themePreferences.animations.speed]}
                    onValueChange={([speed]) => updateAnimations({ speed })}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                  />
                </div>
              )}
            </div>
          </div>

          {/* CSS Variables Debug */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>CSS Variables</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCssVars(!showCssVars)}
              >
                {showCssVars ? 'Hide' : 'Show'} Variables
              </Button>
            </div>
            
            {showCssVars && (
              <div className="bg-muted p-3 rounded-lg text-xs font-mono max-h-32 overflow-y-auto">
                {Object.entries(cssVariables).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-blue-600">{key}:</span>
                    <span className="text-green-600">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visual Test Components */}
      <Card>
        <CardHeader>
          <CardTitle>Component Test Area</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Color Palette Display */}
          <div className="space-y-2">
            <Label>Color Palette</Label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(currentTheme.colors).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div 
                    className="w-12 h-12 rounded-lg border shadow-sm"
                    style={{ background: value }}
                  />
                  <div className="text-xs mt-1 capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample UI Elements */}
          <div className="space-y-4">
            <Label>Sample Components</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              
              <div className="flex gap-2">
                <Badge>Default Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Sample Card</h3>
                <p className="text-muted-foreground text-sm">
                  This is a sample card to test theme colors and styling.
                </p>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Theme Preview Component (for theme selection)
export const ThemePreview: React.FC<{ 
  theme: any;
  isSelected?: boolean;
  onSelect?: () => void;
  showDetails?: boolean;
}> = ({ theme, isSelected = false, onSelect, showDetails = true }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-4 rounded-lg border-2 cursor-pointer transition-all",
        "hover:shadow-md",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-border-hover"
      )}
      onClick={onSelect}
    >
      {/* Theme Preview */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            style={{ background: theme.colors.primary }}
          />
          <div>
            <h3 className="font-semibold text-sm">{theme.name}</h3>
            {showDetails && (
              <p className="text-xs text-muted-foreground">{theme.description}</p>
            )}
          </div>
        </div>
        
        {showDetails && (
          <div className="flex gap-1">
            {Object.entries(theme.colors).slice(0, 5).map(([key, value]) => (
              <div 
                key={key}
                className="w-4 h-4 rounded border"
                style={{ background: value as string }}
                title={key}
              />
            ))}
          </div>
        )}
        
        {theme.category && (
          <Badge variant="outline" className="text-xs">
            {theme.category}
          </Badge>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2"
        >
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
