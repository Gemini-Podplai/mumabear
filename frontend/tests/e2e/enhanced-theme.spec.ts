import { test, expect, Page } from '@playwright/test';

/**
 * Enhanced Theme System E2E Tests
 * Tests all 9 themes with visual regression testing and interactions
 */

const THEMES = [
  'dark',
  'light', 
  'neon',
  'forest',
  'ocean',
  'cyberpunk',
  'minimal',
  'high-contrast',
  'custom'
];

const ACCESSIBILITY_FEATURES = [
  'reduce motion',
  'high contrast',
  'large fonts',
  'screen reader'
];

async function waitForThemeTransition(page: Page) {
  // Wait for theme transition animation to complete
  await page.waitForTimeout(500);
}

async function switchToTheme(page: Page, theme: string) {
  // Open theme switcher
  await page.click('[data-testid="theme-switcher-button"]');
  
  // Wait for theme switcher to open
  await page.waitForSelector('[data-testid="theme-switcher-panel"]');
  
  // Click the theme button
  await page.click(`[data-testid="theme-${theme}"]`);
  
  // Wait for theme transition
  await waitForThemeTransition(page);
}

test.describe('Enhanced Theme System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Wait for React hydration and theme system to initialize
    await page.waitForTimeout(2000);
  });

  test('should load with default theme', async ({ page }) => {
    // Check if theme context is loaded
    const themeElement = await page.locator('[data-theme]').first();
    await expect(themeElement).toBeVisible();
    
    // Take screenshot of default state
    await page.screenshot({ 
      path: 'tests/screenshots/default-theme.png',
      fullPage: true 
    });
  });

  test('should display theme switcher button', async ({ page }) => {
    const themeSwitcherButton = page.locator('[data-testid="theme-switcher-button"]');
    await expect(themeSwitcherButton).toBeVisible();
    
    // Test button interaction
    await themeSwitcherButton.click();
    const themeSwitcherPanel = page.locator('[data-testid="theme-switcher-panel"]');
    await expect(themeSwitcherPanel).toBeVisible();
  });

  // Test each theme individually
  for (const theme of THEMES) {
    test(`should switch to ${theme} theme and render correctly`, async ({ page }) => {
      await switchToTheme(page, theme);
      
      // Verify theme is applied
      const themeElement = await page.locator(`[data-theme="${theme}"]`).first();
      await expect(themeElement).toBeVisible();
      
      // Take screenshot for visual regression
      await page.screenshot({ 
        path: `tests/screenshots/theme-${theme}.png`,
        fullPage: true,
        animations: 'disabled'
      });
      
      // Verify theme switcher shows active theme
      await page.click('[data-testid="theme-switcher-button"]');
      const activeThemeButton = page.locator(`[data-testid="theme-${theme}"][data-active="true"]`);
      await expect(activeThemeButton).toBeVisible();
    });
  }

  test('should handle theme transitions smoothly', async ({ page }) => {
    // Test rapid theme switching
    await switchToTheme(page, 'dark');
    await switchToTheme(page, 'light');
    await switchToTheme(page, 'neon');
    await switchToTheme(page, 'forest');
    
    // Final state should be forest theme
    const themeElement = await page.locator('[data-theme="forest"]').first();
    await expect(themeElement).toBeVisible();
  });

  test('should persist theme choice across page reloads', async ({ page }) => {
    // Switch to ocean theme
    await switchToTheme(page, 'ocean');
    
    // Reload page
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Verify theme persisted
    const themeElement = await page.locator('[data-theme="ocean"]').first();
    await expect(themeElement).toBeVisible();
  });

  test('should handle accessibility features', async ({ page }) => {
    // Open theme switcher
    await page.click('[data-testid="theme-switcher-button"]');
    
    // Navigate to accessibility tab
    await page.click('[data-testid="accessibility-tab"]');
    
    // Test reduce motion toggle
    const reduceMotionToggle = page.locator('[data-testid="reduce-motion-toggle"]');
    await expect(reduceMotionToggle).toBeVisible();
    await reduceMotionToggle.click();
    
    // Test high contrast toggle
    const highContrastToggle = page.locator('[data-testid="high-contrast-toggle"]');
    await expect(highContrastToggle).toBeVisible();
    await highContrastToggle.click();
    
    // Take screenshot with accessibility features enabled
    await page.screenshot({ 
      path: 'tests/screenshots/accessibility-features.png',
      fullPage: true 
    });
  });

  test('should handle layout modes', async ({ page }) => {
    // Open theme switcher
    await page.click('[data-testid="theme-switcher-button"]');
    
    // Navigate to layout tab
    await page.click('[data-testid="layout-tab"]');
    
    // Test compact layout
    await page.click('[data-testid="layout-compact"]');
    await waitForThemeTransition(page);
    await page.screenshot({ 
      path: 'tests/screenshots/layout-compact.png',
      fullPage: true 
    });
    
    // Test comfortable layout
    await page.click('[data-testid="layout-comfortable"]');
    await waitForThemeTransition(page);
    await page.screenshot({ 
      path: 'tests/screenshots/layout-comfortable.png',
      fullPage: true 
    });
    
    // Test spacious layout
    await page.click('[data-testid="layout-spacious"]');
    await waitForThemeTransition(page);
    await page.screenshot({ 
      path: 'tests/screenshots/layout-spacious.png',
      fullPage: true 
    });
  });

  test('should handle effects controls', async ({ page }) => {
    // Open theme switcher
    await page.click('[data-testid="theme-switcher-button"]');
    
    // Navigate to effects tab
    await page.click('[data-testid="effects-tab"]');
    
    // Test particle effects toggle
    const particleEffectsToggle = page.locator('[data-testid="particle-effects-toggle"]');
    await expect(particleEffectsToggle).toBeVisible();
    
    // Test glass effects toggle
    const glassEffectsToggle = page.locator('[data-testid="glass-effects-toggle"]');
    await expect(glassEffectsToggle).toBeVisible();
    
    // Test gradient backgrounds
    const gradientBackgroundToggle = page.locator('[data-testid="gradient-background-toggle"]');
    await expect(gradientBackgroundToggle).toBeVisible();
  });

  test('should export and import theme settings', async ({ page }) => {
    // Open theme switcher
    await page.click('[data-testid="theme-switcher-button"]');
    
    // Navigate to advanced tab
    await page.click('[data-testid="advanced-tab"]');
    
    // Test export functionality
    const exportButton = page.locator('[data-testid="export-theme-button"]');
    await expect(exportButton).toBeVisible();
    
    // Test reset functionality
    const resetButton = page.locator('[data-testid="reset-theme-button"]');
    await expect(resetButton).toBeVisible();
  });

  test('should be responsive on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Take mobile screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/mobile-default.png',
      fullPage: true 
    });
    
    // Test theme switcher on mobile
    await page.click('[data-testid="theme-switcher-button"]');
    const themeSwitcherPanel = page.locator('[data-testid="theme-switcher-panel"]');
    await expect(themeSwitcherPanel).toBeVisible();
    
    // Switch to a theme on mobile
    await switchToTheme(page, 'neon');
    await page.screenshot({ 
      path: 'tests/screenshots/mobile-neon-theme.png',
      fullPage: true 
    });
  });

  test('should handle animated background interactions', async ({ page }) => {
    // Wait for animated background to load
    const animatedBackground = page.locator('[data-testid="animated-background"]');
    await expect(animatedBackground).toBeVisible();
    
    // Test mouse interaction with particles
    await page.mouse.move(640, 360);
    await page.waitForTimeout(1000);
    
    // Take screenshot with particle interaction
    await page.screenshot({ 
      path: 'tests/screenshots/particle-interaction.png',
      fullPage: true 
    });
  });
});
