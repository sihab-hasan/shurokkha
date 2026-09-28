"use client"

import { LogOut, ShieldCheck } from "lucide-react"
import Link from "next/link"

import { Button } from "@shurokkha/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shurokkha/ui/components/dropdown-menu"
import { ThemeSwitcher } from "@shurokkha/ui/components/theme-switcher"

import { useAuth } from "@/components/auth/auth-provider"

export function AdminHeader() {
  const { status, user, signOut } = useAuth()
  const initials =
    user?.name
      ?.split(/\s+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SA"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight md:hidden"
        >
          Shurokkha Admin
        </Link>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Internal operations workspace</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-2 rounded-full px-2"
                aria-label="Open account menu"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials}
                </span>
                <span className="hidden text-sm font-medium sm:inline">
                  {user?.name ?? "Admin"}
                </span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {status === "authenticated"
                ? (user?.email ?? "Signed in")
                : "Not signed in"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                void signOut()
              }}
              disabled={status !== "authenticated"}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
