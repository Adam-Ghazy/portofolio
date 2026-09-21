'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

/**
 * Bilingual editing controls shared by every admin content form.
 * The switch selects which language's fields the form edits; it sits inside the
 * form card (DESIGN.md: controls belong in the card, never a second page header).
 */
export function LangTabs({
  value,
  onChange,
  idLabel = 'ID',
  enLabel = 'EN',
}: {
  value: 'id' | 'en'
  onChange: (next: 'id' | 'en') => void
  idLabel?: string
  enLabel?: string
}) {
  return (
    <div
      role="tablist"
      aria-label="Editing language"
      className="inline-flex items-center gap-0.5 rounded-[12px] border border-border bg-sidebar p-0.5"
    >
      {([['id', idLabel], ['en', enLabel]] as const).map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={value === key}
          onClick={() => onChange(key)}
          className={cn(
            'h-7 rounded-[8px] px-2.5 text-label-md transition-colors',
            value === key
              ? 'bg-primary font-semibold text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function AutoTranslateButton({
  onClick,
  disabled,
  busy,
  from = 'ID',
  to = 'EN',
}: {
  onClick: () => void
  disabled?: boolean
  busy?: boolean
  from?: string
  to?: string
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={busy || disabled}
      className="w-full"
    >
      <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
      {busy ? `Translating ${from} to ${to}…` : `Auto-translate ${from} to ${to}`}
    </Button>
  )
}
