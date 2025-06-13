import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'default' | 'high-contrast' | 'dark-mode-teal' | 'soft-purple' | 'soothing-blue' | 'minimal-grey' | 'warm-light' | 'deep-focus-dark';

interface ThemeState {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: 'default',
      setTheme: (theme) => set({ currentTheme: theme }),
    }),
    {
      name: 'theme-preference',
    }
  )
);