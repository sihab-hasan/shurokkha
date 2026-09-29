"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, ShieldCheck } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shurokkha/ui/components/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@shurokkha/ui/components/sheet"
import { ThemeSwitcher } from "@shurokkha/ui/components/theme-switcher"
import { cn } from "@shurokkha/ui/lib/utils"

import { useAuth } from "@/components/auth/auth-provider"
import { adminShellConfig } from "@/config/shell-config"
import type { AdminNavItem } from "@/config/admin-navigation"

export function AdminHeader() {
  const { status, user, signOut } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const primary: ReadonlyArray<AdminNavItem> = adminShellConfig.primary ?? []
  const utility: ReadonlyArray<AdminNavItem> = adminShellConfig.utility ?? []

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === "/") return pathname === "/"
    if (href === "/operations") return pathname === "/operations"
    if (href === "/reports") return pathname === "/reports"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const categories = Array.from(
    new Set(primary.map((item) => item.category ?? "General"))
  )

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
        {/* Mobile Navigation Drawer */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label="Open navigation menu"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="flex w-72 flex-col p-0">
              <SheetHeader className="border-b px-5 py-4 text-left">
                <SheetTitle className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground shadow-xs">
                    SA
                  </span>
                  <div className="flex flex-col">
                    <span className="leading-tight">
                      {adminShellConfig.brand?.name ?? "Shurokkha Admin"}
                    </span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                      Command Console
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <nav
                aria-label="Admin mobile navigation"
                className="flex-1 space-y-4 overflow-y-auto p-4"
              >
                {categories.map((category) => {
                  const items = primary.filter(
                    (item) => (item.category ?? "General") === category
                  )
                  return (
                    <div key={category} className="space-y-1">
                      <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                        {category}
                      </div>
                      {items.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors",
                              active
                                ? "bg-primary/10 font-semibold text-primary shadow-xs"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              {Icon ? (
                                <Icon
                                  className={cn(
                                    "size-4 shrink-0 transition-colors",
                                    active
                                      ? "text-primary"
                                      : "text-muted-foreground group-hover:text-foreground"
                                  )}
                                />
                              ) : null}
                              <span>{item.label}</span>
                            </div>
                            {item.badge != null ? (
                              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                {item.badge}
                              </span>
                            ) : null}
                          </Link>
                        )
                      })}
                    </div>
                  )
                })}

                {utility.length > 0 ? (
                  <div className="space-y-1 border-t pt-2">
                    <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                      Administration
                    </div>
                    {utility.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors",
                            active
                              ? "bg-primary/10 font-semibold text-primary shadow-xs"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            {Icon ? (
                              <Icon
                                className={cn(
                                  "size-4 shrink-0 transition-colors",
                                  active
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover:text-foreground"
                                )}
                              />
                            ) : null}
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight md:hidden"
        >
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
            SA
          </span>
          <span>Shurokkha Admin</span>
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
