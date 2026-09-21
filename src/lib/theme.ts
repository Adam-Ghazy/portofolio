/**
 * Theme resolution, shared by the pre-paint bootstrap in `app/layout.tsx` and
 * `components/ThemeProvider.tsx`.
 *
 * Two surfaces, two persisted preferences. The public site follows the OS
 * preference until the visitor chooses otherwise; the admin ("Industrial
 * Governance", DESIGN.md § Theme) is authored light-first, so it stays light
 * until an operator explicitly asks for dark — a dark OS does not flip it.
 */
export type Theme = 'light' | 'dark'

export const PUBLIC_THEME_KEY = 'portfolio-theme'
export const ADMIN_THEME_KEY = 'portfolio-admin-theme'

export function isAdminPath(pathname: string) {
  return pathname.startsWith('/admin')
}

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    // Storage throws when cookies/site data are blocked; fall through to defaults.
    return null
  }
}

/** Stored preference wins; otherwise admin defaults to light and the site to the OS. */
export function resolveTheme(isAdmin: boolean): Theme {
  const stored = readStored(isAdmin ? ADMIN_THEME_KEY : PUBLIC_THEME_KEY)
  if (isTheme(stored)) return stored
  if (isAdmin) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function persistTheme(isAdmin: boolean, theme: Theme) {
  try {
    window.localStorage.setItem(isAdmin ? ADMIN_THEME_KEY : PUBLIC_THEME_KEY, theme)
  } catch {
    // The theme still applies for this session.
  }
}

/**
 * `.dark` on <html> is the single switch: it drives the public runtime palette
 * (`--bg-*`, `--accent`) and the admin token overrides in globals.css.
 * `color-scheme` for native chrome is owned by the stylesheet, not by JS.
 */
export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

/**
 * Runs in <head> before first paint, ahead of any bundle, so a dark-preferring
 * visitor never sees a light frame — including the admin, whose shell waits for
 * hydration before it renders.
 *
 * MUST stay behaviourally identical to `resolveTheme` + `applyTheme` above; it
 * is a string because it cannot import them. The storage keys are interpolated
 * from the same constants, so only the few lines of logic are mirrored.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var a=location.pathname.indexOf("/admin")===0;var s=localStorage.getItem(a?"${ADMIN_THEME_KEY}":"${PUBLIC_THEME_KEY}");var t=(s==="light"||s==="dark")?s:(a?"light":(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`
