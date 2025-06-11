import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Enhanced Theme System Types
export interface ThemeVariant {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border?: string;
  };
  icon?: ReactNode;
  category?: 'sanctuary' | 'professional' | 'creative' | 'accessibility' | 'seasonal';
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorBlindSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  keyboardNavigation: boolean;
  screenReaderOptimized: boolean;
}

export interface AnimationSettings {
  enabled: boolean;
  speed: number; // 0.5 to 2.0
  particles: boolean;
  transitions: boolean;
}

export interface ThemePreferences {
  selectedTheme: string;
  selectedBackground: string;
  customColors: Record<string, string>;
  accessibility: AccessibilitySettings;
  animations: AnimationSettings;
  layout: 'compact' | 'comfortable' | 'spacious';
}

// Enhanced Theme Variants
export const ENHANCED_THEME_VARIANTS: ThemeVariant[] = [
  {
    id: 'sanctuary',
    name: 'Sanctuary Forest',
    description: 'Calming forest greens with nature-inspired gradients',
    category: 'sanctuary',
    colors: {
      primary: 'linear-gradient(135deg, #2D5A3D 0%, #4A7C59 100%)',
      secondary: 'linear-gradient(135deg, #5D8A6B 0%, #7BA185 100%)',
      accent: 'linear-gradient(135deg, #8FBC8F 0%, #98FB98 100%)',
      background: '#F8FDF9',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#2C3E2F',
      border: '#D1FAE5'
    }
  },
  {
    id: 'daytime',
    name: 'Bright Daytime',
    description: 'Clean and bright theme perfect for daytime work',
    category: 'professional',
    colors: {
      primary: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
      secondary: 'linear-gradient(135deg, #93C5FD 0%, #BFDBFE 100%)',
      accent: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
      background: '#FFFFFF',
      surface: 'rgba(255, 255, 255, 0.9)',
      text: '#1E3A8A',
      border: '#E0E7FF'
    }
  },
  {
    id: 'neon',
    name: 'Neon Cyberpunk',
    description: 'Vibrant neon colors with cyberpunk aesthetics',
    category: 'creative',
    colors: {
      primary: 'linear-gradient(135deg, #FF0080 0%, #FF0040 100%)',
      secondary: 'linear-gradient(135deg, #00FFFF 0%, #0080FF 100%)',
      accent: 'linear-gradient(135deg, #FFFF00 0%, #FF8000 100%)',
      background: '#0A0A0A',
      surface: 'rgba(20, 20, 20, 0.9)',
      text: '#FFFFFF',
      border: '#FF0080'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Deep ocean blues with calming wave patterns',
    category: 'sanctuary',
    colors: {
      primary: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      secondary: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
      accent: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
      background: '#F8FAFC',
      surface: 'rgba(248, 250, 252, 0.95)',
      text: '#0F172A',
      border: '#CBD5E1'
    }
  },
  {
    id: 'forest',
    name: 'Enchanted Forest',
    description: 'Mystical forest greens with magical undertones',
    category: 'creative',
    colors: {
      primary: 'linear-gradient(135deg, #166534 0%, #22C55E 100%)',
      secondary: 'linear-gradient(135deg, #15803D 0%, #4ADE80 100%)',
      accent: 'linear-gradient(135deg, #84CC16 0%, #A3E635 100%)',
      background: '#F0FDF4',
      surface: 'rgba(240, 253, 244, 0.95)',
      text: '#14532D',
      border: '#BBF7D0'
    }
  },
  {
    id: 'minimal',
    name: 'Pure Minimal',
    description: 'Clean minimalist design with maximum focus',
    category: 'professional',
    colors: {
      primary: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
      secondary: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
      accent: 'linear-gradient(135deg, #D1D5DB 0%, #E5E7EB 100%)',
      background: '#FFFFFF',
      surface: 'rgba(255, 255, 255, 0.98)',
      text: '#111827',
      border: '#F3F4F6'
    }
  },
  {
    id: 'high_contrast',
    name: 'High Contrast',
    description: 'Maximum contrast for optimal accessibility',
    category: 'accessibility',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      background: '#FFFFFF',
      surface: '#F9F9F9',
      text: '#000000',
      border: '#000000'
    }
  },
  {
    id: 'cosmic',
    name: 'Cosmic Purple',
    description: 'Deep space purples with stellar gradients',
    category: 'creative',
    colors: {
      primary: 'linear-gradient(135deg, #581C87 0%, #7C3AED 100%)',
      secondary: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      accent: 'linear-gradient(135deg, #C4B5FD 0%, #DDD6FE 100%)',
      background: '#FAF5FF',
      surface: 'rgba(250, 245, 255, 0.95)',
      text: '#581C87',
      border: '#E9D5FF'
    }
  }
];

// Theme Context Interface
interface ThemeContextValue {
  // Current theme state
  currentTheme: ThemeVariant;
  themePreferences: ThemePreferences;
  
  // Theme management
  setTheme: (themeId: string) => void;
  updatePreferences: (prefs: Partial<ThemePreferences>) => void;
  resetTheme: () => void;
  
  // Preview functionality
  previewTheme: (themeId: string) => void;
  exitPreview: () => void;
  isPreviewMode: boolean;
  
  // Accessibility
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  updateAnimations: (settings: Partial<AnimationSettings>) => void;
  
  // Theme variants
  availableThemes: ThemeVariant[];
  
  // CSS Variables
  cssVariables: Record<string, string>;
}

const defaultAccessibilitySettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  fontSize: 'medium',
  colorBlindSupport: 'none',
  keyboardNavigation: true,
  screenReaderOptimized: false
};

const defaultAnimationSettings: AnimationSettings = {
  enabled: true,
  speed: 1.0,
  particles: true,
  transitions: true
};

const defaultPreferences: ThemePreferences = {
  selectedTheme: 'sanctuary',
  selectedBackground: 'default',
  customColors: {},
  accessibility: defaultAccessibilitySettings,
  animations: defaultAnimationSettings,
  layout: 'comfortable'
};

// Create Context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Theme Provider Component
export const EnhancedThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themePreferences, setThemePreferences] = useState<ThemePreferences>(defaultPreferences);
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Get current theme (preview or selected)
  const currentThemeId = previewThemeId || themePreferences.selectedTheme;
  const currentTheme = ENHANCED_THEME_VARIANTS.find(t => t.id === currentThemeId) || ENHANCED_THEME_VARIANTS[0];

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('podplay-theme-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setThemePreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse saved theme preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('podplay-theme-preferences', JSON.stringify(themePreferences));
  }, [themePreferences]);

  // Generate CSS variables from current theme
  const cssVariables = React.useMemo(() => {
    const vars: Record<string, string> = {};
    
    // Base theme colors
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      vars[`--theme-${key}`] = value;
    });

    // Accessibility adjustments
    if (themePreferences.accessibility.highContrast) {
      vars['--theme-contrast-multiplier'] = '1.5';
    }

    // Font size adjustments
    const fontSizeMap = {
      'small': '0.875rem',
      'medium': '1rem',
      'large': '1.125rem',
      'extra-large': '1.25rem'
    };
    vars['--theme-font-size-base'] = fontSizeMap[themePreferences.accessibility.fontSize];

    // Animation settings
    if (!themePreferences.animations.enabled || themePreferences.accessibility.reducedMotion) {
      vars['--theme-animation-duration'] = '0s';
      vars['--theme-transition-duration'] = '0s';
    } else {
      const speed = themePreferences.animations.speed;
      vars['--theme-animation-duration'] = `${1 / speed}s`;
      vars['--theme-transition-duration'] = `${0.3 / speed}s`;
    }

    // Layout spacing
    const layoutSpacing = {
      'compact': '0.5rem',
      'comfortable': '1rem',
      'spacious': '1.5rem'
    };
    vars['--theme-spacing-unit'] = layoutSpacing[themePreferences.layout];

    return vars;
  }, [currentTheme, themePreferences]);

  // Apply CSS variables to root element
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply theme class for CSS-based styling
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${currentTheme.id}`);

    // Apply accessibility classes
    if (themePreferences.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (themePreferences.accessibility.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Apply layout class
    root.className = root.className.replace(/layout-\w+/g, '');
    root.classList.add(`layout-${themePreferences.layout}`);

    return () => {
      // Cleanup on unmount
      Object.keys(cssVariables).forEach(property => {
        root.style.removeProperty(property);
      });
    };
  }, [cssVariables, currentTheme.id, themePreferences.accessibility, themePreferences.layout]);

  // Theme management functions
  const setTheme = (themeId: string) => {
    setThemePreferences(prev => ({
      ...prev,
      selectedTheme: themeId
    }));
    exitPreview(); // Exit preview mode when setting theme
  };

  const updatePreferences = (prefs: Partial<ThemePreferences>) => {
    setThemePreferences(prev => ({ ...prev, ...prefs }));
  };

  const resetTheme = () => {
    setThemePreferences(defaultPreferences);
    exitPreview();
  };

  const previewTheme = (themeId: string) => {
    setPreviewThemeId(themeId);
    setIsPreviewMode(true);
  };

  const exitPreview = () => {
    setPreviewThemeId(null);
    setIsPreviewMode(false);
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setThemePreferences(prev => ({
      ...prev,
      accessibility: { ...prev.accessibility, ...settings }
    }));
  };

  const updateAnimations = (settings: Partial<AnimationSettings>) => {
    setThemePreferences(prev => ({
      ...prev,
      animations: { ...prev.animations, ...settings }
    }));
  };

  const contextValue: ThemeContextValue = {
    currentTheme,
    themePreferences,
    setTheme,
    updatePreferences,
    resetTheme,
    previewTheme,
    exitPreview,
    isPreviewMode,
    updateAccessibility,
    updateAnimations,
    availableThemes: ENHANCED_THEME_VARIANTS,
    cssVariables
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useEnhancedTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }
  return context;
};

// Export for backward compatibility
export { useEnhancedTheme as useTheme };
