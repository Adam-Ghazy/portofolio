'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { applyTheme, isAdminPath, persistTheme, resolveTheme, type Theme } from '@/lib/theme';

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
}>({ theme: 'light', toggle: () => {}, setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * One theme per surface. The public site follows the OS preference; the admin
 * keeps its own preference (light until asked otherwise — DESIGN.md § Theme),
 * so switching the admin never repaints the portfolio and vice versa.
 *
 * The pre-paint bootstrap in `app/layout.tsx` has already put the correct class
 * on <html>, so there is no flash to defend against here: state starts at
 * `light` — the value the server rendered — and syncs from storage in the effect
 * below. A lazy initializer that read the class off the DOM would hydrate
 * mismatched and is deliberately avoided; the toggle icon catching up one frame
 * late is the cheaper trade.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '';
  const isAdmin = isAdminPath(pathname);
  const [theme, setThemeState] = useState<Theme>('light');

  // Runs on mount and on every surface change: admin <-> public is a client-side
  // transition, so the bootstrap script cannot re-run for it.
  useEffect(() => {
    const resolved = resolveTheme(isAdmin);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating the persisted theme from an external store; the rule fires on the pre-existing code too
    setThemeState(resolved);
    applyTheme(resolved);
  }, [isAdmin]);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      applyTheme(next);
      persistTheme(isAdmin, next);
    },
    [isAdmin]
  );

  const toggle = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [setTheme, theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
