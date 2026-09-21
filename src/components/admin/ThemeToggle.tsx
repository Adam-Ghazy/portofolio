'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

/**
 * Flips the admin between the light and dark Industrial Governance palettes
 * (DESIGN.md § Theme). The preference is admin-scoped, so toggling here never
 * repaints the public site.
 *
 * The icon, not a label, carries the state — the system has no room for a
 * second text control in the header. `theme` is `light` on both the server and
 * the first client render, so the icon hydrates without a mismatch; the
 * pre-paint script has already set the correct class by then.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      className={cn('h-8 w-8', className)}
    >
      {dark ? (
        <Sun className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.5} />
      )}
    </Button>
  )
}
