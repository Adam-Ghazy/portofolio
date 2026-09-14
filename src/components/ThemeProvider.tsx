'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
  mounted: boolean;
}>({ theme: 'dark', toggle: () => {}, mounted: false });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('portfolio-theme') as Theme;
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
    } else {
      const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = preferDark ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.classList.toggle('dark', initial === 'dark');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('portfolio-theme', theme);
  }, [theme, mounted]);

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
