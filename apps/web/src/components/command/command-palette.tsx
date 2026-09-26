"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowRight,
  ClipboardList,
  Eraser,
  FilePlus2,
  Home,
  KeyRound,
  LifeBuoy,
  Search,
  ShieldAlert,
  UserCircle2,
  Users,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@shurokkha/ui/components/command"

import { routes } from "@/config/routes"

/**
 * Global ⌘K / Ctrl-K command palette.
 *
 * - Listens for the hotkey at the document level
 * - Opens a CommandDialog with grouped navigation + action items
 * - Items navigate via router.push() and close the dialog
 * - Search input is filtered live by cmdk
 *
 * Mounted once at the root layout (`apps/web/src/app/layout.tsx`) so it's
 * available on every page.
 */
export function CommandPalette() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Hotkey listener (⌘K on mac, Ctrl-K elsewhere). Skips while typing in
  // inputs (textarea/contenteditable) to avoid stomping native shortcuts.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isHotkey =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"
      if (!isHotkey) return

      const target = event.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          return
        }
      }

      event.preventDefault()
      setOpen((prev) => !prev)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const close = () => setOpen(false)
  const go = (path: string) => {
    close()
    router.push(path)
  }

  const isOnAssistance = pathname === routes.account.assistance
  const isOnMissingPersons = pathname === routes.account.missingPersons

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command Palette">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem value="Home" onSelect={() => go(routes.account.home)}>
            <Home />
            <span>Home</span>
            <CommandShortcut>G H</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="Assistance"
            onSelect={() => go(routes.account.assistance)}
          >
            <LifeBuoy />
            <span>Assistance requests</span>
            <CommandShortcut>G A</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="Missing persons"
            onSelect={() => go(routes.account.missingPersons)}
          >
            <Search />
            <span>Missing persons</span>
            <CommandShortcut>G M</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="Volunteering"
            onSelect={() => go("/account/volunteering")}
          >
            <Users />
            <span>Volunteering</span>
            <CommandShortcut>G V</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="Donations"
            onSelect={() => go(routes.account.donations)}
          >
            <ClipboardList />
            <span>Donations</span>
          </CommandItem>
          <CommandItem value="Profile" onSelect={() => go("/account/profile")}>
            <UserCircle2 />
            <span>Profile</span>
          </CommandItem>
          <CommandItem
            value="Security"
            onSelect={() => go("/account/settings/security")}
          >
            <KeyRound />
            <span>Security</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem
            value="New assistance request"
            onSelect={() => go(routes.account.createAssistance)}
          >
            <FilePlus2 />
            <span>New assistance request</span>
            <CommandShortcut>N A</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="New missing person report"
            onSelect={() => go(routes.account.createMissingPerson)}
          >
            <FilePlus2 />
            <span>New missing person report</span>
            <CommandShortcut>N M</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="View emergencies"
            onSelect={() => go("/account/emergencies")}
          >
            <ShieldAlert />
            <span>Active emergencies</span>
            <ArrowRight />
          </CommandItem>
        </CommandGroup>

        {isOnAssistance ? (
          <CommandGroup heading="Current page">
            <ClearFiltersCommand
              onSelect={() => go(routes.account.assistance)}
            />
          </CommandGroup>
        ) : null}
        {isOnMissingPersons ? (
          <CommandGroup heading="Current page">
            <ClearFiltersCommand
              onSelect={() => go(routes.account.missingPersons)}
            />
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  )
}

function ClearFiltersCommand({ onSelect }: { onSelect: () => void }) {
  // The hook-based "is filter active" check would require useSearchParams,
  // which is forbidden at root layout scope. We render this item always;
  // selecting it routes to the bare pathname, which clears filters via the
  // hooks' reset logic. Provide an explicit icon + label so it's
  // discoverable in the empty filter state too.
  return (
    <CommandItem
      value="Clear all filters"
      onSelect={() => {
        onSelect()
      }}
    >
      <Eraser />
      <span>Clear all filters on this page</span>
    </CommandItem>
  )
}
