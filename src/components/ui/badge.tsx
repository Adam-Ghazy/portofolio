import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Status pills — DESIGN.md § Status Pills.
 * Colour is reserved for lifecycle state; every pill carries a text label.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-muted text-muted-foreground",
        destructive: "bg-status-expired-bg text-status-expired-text",
        outline: "border border-border text-muted-foreground",
        active: "bg-status-active-bg text-status-active-text",
        pending: "bg-status-pending-bg text-status-pending-text",
        expired: "bg-status-expired-bg text-status-expired-text",
        draft: "bg-status-draft-bg text-status-draft-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
