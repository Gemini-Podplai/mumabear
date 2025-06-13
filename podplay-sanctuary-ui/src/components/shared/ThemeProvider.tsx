import React, { useEffect } from 'react';
import { useThemeStore } from '../../state/themeStore';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const currentTheme = useThemeStore((state) => state.currentTheme);

  useEffect(() => {
    const body = document.body;
    body.className = ''; // Clear existing classes
    body.classList.add(currentTheme);
  }, [currentTheme]);

  return <>{children}</>;
};

export default ThemeProvider;