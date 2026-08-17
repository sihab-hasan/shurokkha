"use client"

import { Bell, Command, Search, ShieldCheck } from "lucide-react"

import { WorkspaceShellHeader } from "@shurokkha/ui-patterns/layout"
import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shurokkha/ui/components/input-group"
import { SidebarTrigger } from "@shurokkha/ui/components/sidebar"

import { ThemeSwitcher } from "@shurokkha/ui/components/theme-switcher"

export function AdminHeader() {
  return (
    <WorkspaceShellHeader className="px-3 sm:px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="rounded-full" />
        <div className="hidden items-center gap-2 md:flex">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-4" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Shurokkha</div>
            <div className="text-[11px] text-muted-foreground">
              Admin command center
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-xl px-8 lg:block">
        <InputGroup>
          <InputGroupInput
            placeholder="Search incidents, people, shelters..."
            aria-label="Search admin"
          />
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          <InputGroupAddon
            align="inline-end"
            className="gap-1 text-[11px] text-muted-foreground"
          >
            <Command className="size-3" /> K
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Badge variant="outline" className="hidden sm:inline-flex">
          Live operations
        </Badge>
        <ThemeSwitcher />
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label="Notifications"
        >
          <Bell />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive ring-2 ring-sidebar" />
        </Button>
        <div className="ml-1 flex items-center gap-2 border-l pl-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            SA
          </span>
          <div className="hidden leading-tight xl:block">
            <div className="text-xs font-semibold">System Admin</div>
            <div className="text-[11px] text-muted-foreground">
              National operations
            </div>
          </div>
        </div>
      </div>
    </WorkspaceShellHeader>
  )
}
