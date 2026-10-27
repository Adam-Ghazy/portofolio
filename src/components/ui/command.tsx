"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-[12px] bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  open,
  onOpenChange,
  title = "Command palette",
  description = "Type a command or search",
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
}) {
  return (
    // Radix Dialog drives focus trap + ESC; cmdk renders the searchable list.
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50",
        open ? "block" : "hidden"
      )}
      {...(open ? {} : { inert: true as never })}
      onKeyDown={(e) => {
        if (e.key === "Escape") onOpenChange(false)
      }}
    >
      <button
        aria-label="Close command palette"
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-foreground/20 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed left-1/2 top-[18%] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 outline-none">
        <p className="sr-only">{description}</p>
        <Command
          loop
          className="border border-border shadow-modal"
          onKeyDown={(e) => {
            if (e.key === "Escape") onOpenChange(false)
          }}
        >
          {children}
        </Command>
      </div>
    </div>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4">
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
      <CommandPrimitive.Input
        className={cn(
          "flex h-12 w-full bg-transparent py-3 text-body-md text-foreground outline-none placeholder:text-placeholder disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn("max-h-[320px] overflow-y-auto overflow-x-hidden p-1", className)}
      {...props}
    />
  )
}

function CommandEmpty(
  props: React.ComponentProps<typeof CommandPrimitive.Empty>
) {
  return (
    <CommandPrimitive.Empty
      className="py-8 text-center text-body-md text-muted-foreground"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-label-section [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2.5 rounded-[8px] px-3 py-2.5 text-body-md outline-none transition-colors data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
    />
  )
}

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-label-sm tracking-widest text-muted-foreground", className)}
    {...props}
  />
)

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
