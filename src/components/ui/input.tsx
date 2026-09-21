import * as React from "react"

import { cn } from "@/lib/utils"

/** DESIGN.md § Form Inputs — 42px tall, 12px radius, hairline border, focus border #222222. */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[42px] w-full rounded-[12px] border border-input bg-surface px-[14px] py-0 text-body-md text-foreground transition-colors file:border-0 file:bg-transparent file:text-label-md file:text-foreground placeholder:text-placeholder placeholder:font-normal focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
