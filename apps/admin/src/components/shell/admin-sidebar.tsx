"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@shurokkha/ui/lib/utils"

import { adminShellConfig } from "@/config/shell-config"

type NavItem = {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

export function AdminSidebar() {
  const pathname = usePathname()
  const primary: ReadonlyArray<NavItem> = adminShellConfig.primary ?? []
  const utility: ReadonlyArray<NavItem> = adminShellConfig.utility ?? []

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside className="hidden h-full w-64 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center border-b px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
            SA
          </span>
          {adminShellConfig.brand?.name ?? "Shurokkha Admin"}
        </Link>
      </div>

      <nav
        aria-label="Admin primary navigation"
        className="flex-1 space-y-1 overflow-y-auto p-3"
      >
        {primary.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            No sections configured.
          </p>
        ) : (
          primary.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {Icon ? <Icon className="size-4" /> : null}
                <span>{item.label}</span>
              </Link>
            )
          })
        )}
      </nav>

      {utility.length > 0 ? (
        <div className="border-t p-3">
          <nav aria-label="Admin utility navigation" className="space-y-1">
            {utility.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {Icon ? <Icon className="size-4" /> : null}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      ) : null}
    </aside>
  )
}
