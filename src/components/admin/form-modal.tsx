'use client'

import { useEffect } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  headerExtra?: React.ReactNode
  children: React.ReactNode
  /** Footer content, e.g. submit/cancel buttons */
  footer: React.ReactNode
  /** Max width class for the panel, default max-w-lg */
  wide?: boolean
}

/**
 * Centered modal for admin add/edit forms. Body scrolls independently so long
 * bilingual forms stay usable; footer stays pinned at the bottom.
 */
export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  headerExtra,
  children,
  footer,
  wide = false,
}: FormModalProps) {
  // Lock body scroll while open (Radix removes scrollbar; prevent layout shift)
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[16px] border border-border bg-card shadow-modal outline-none',
            'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'
          )}
        >
          <DialogPrimitive.Title className="flex items-start justify-between gap-3 border-b border-border px-5 py-4 text-headline-sm font-semibold text-foreground">
            <span>{title}</span>
            <DialogPrimitive.Close
              className="rounded-[8px] p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </DialogPrimitive.Close>
          </DialogPrimitive.Title>

          {description && (
            <DialogPrimitive.Description className="border-b border-border bg-muted/30 px-5 py-2.5 text-body-sm text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          )}

          {headerExtra && <div className="border-b border-border px-5 py-3">{headerExtra}</div>}

          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

          {footer && <div className="border-t border-border px-5 py-3.5">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
