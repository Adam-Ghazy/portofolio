"use client"

import { Toaster as Sonner } from "sonner"

import { useTheme } from "@/components/ThemeProvider"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Admin toasts, on the Industrial Governance palette (DESIGN.md § Theme).
 *
 * Styled through sonner's own CSS variables rather than through `classNames`:
 * sonner's stylesheet reaches `[data-sonner-toast][data-styled]` (specificity
 * 0,2,0) and `[data-sonner-toast][data-styled] [data-title]` (0,3,0), which
 * outranks every `group-[.toast]:*` utility (0,1,0) — the class list that used
 * to live here was dead in both themes and only *looked* right because sonner's
 * light defaults happen to be white. Inline variables beat the stylesheet
 * outright, and sonner reads them for the surface, text, border, radius and for
 * the action/cancel buttons (action = `--normal-text` on `--normal-bg`, i.e.
 * exactly the accent fill the design specifies).
 *
 * Toast types stay monochrome: `richColors` must not be enabled, because the
 * four status pairs are reserved for lifecycle state and nothing else.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      style={
        {
          "--normal-bg": "var(--color-surface)",
          "--normal-text": "var(--color-foreground)",
          "--normal-border": "var(--color-border)",
          "--normal-bg-hover": "var(--color-secondary)",
          "--normal-border-hover": "var(--color-border-strong)",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
