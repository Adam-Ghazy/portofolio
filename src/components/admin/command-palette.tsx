'use client'

import { useRouter } from 'next/navigation'
import { ExternalLink, LogOut } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { adminNavigation } from './app-sidebar'

/**
 * ⌘K palette: navigates every admin page + "View Site". Opens via the search
 * button in the admin header; toggled by Cmd/Ctrl+K from AdminShell; ESC closes.
 */
export function CommandPalette({
  open,
  onOpenChange,
  onLogout,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogout: () => void
}) {
  const router = useRouter()

  const go = (href: string) => {
    onOpenChange(false)
    router.push(href)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a page or command…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {adminNavigation.map((section) => (
          <CommandGroup key={section.label} heading={section.label}>
            {section.items.map((item) => (
              <CommandItem
                key={item.href}
                value={`${item.name} ${section.label}`}
                onSelect={() => go(item.href)}
              >
                <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => go('/admin/settings')}>
            <LogOut className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            Account settings
          </CommandItem>
          <CommandItem
            value="view site open public portfolio"
            onSelect={() => {
              onOpenChange(false)
              window.open('/', '_blank', 'noopener,noreferrer')
            }}
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            View Site
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onOpenChange(false)
              onLogout()
            }}
          >
            <LogOut className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            Log out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
