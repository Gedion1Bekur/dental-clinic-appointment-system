import { createContext, useContext, useState, useCallback } from 'react';
import { storage } from '../utils/storage';

const ThemeContext = createContext(null);

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
  storage.setTheme(theme);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove('theme-switching');
    });
  });
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => storage.getTheme());

  const setTheme = useCallback((next) => {
    applyTheme(next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
