"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@shurokkha/ui/lib/utils"

import { adminShellConfig } from "@/config/shell-config"
import type { AdminNavItem } from "@/config/admin-navigation"

export function AdminSidebar() {
  const pathname = usePathname()
  const primary: ReadonlyArray<AdminNavItem> = adminShellConfig.primary ?? []
  const utility: ReadonlyArray<AdminNavItem> = adminShellConfig.utility ?? []

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === "/") return pathname === "/"
    if (href === "/operations") return pathname === "/operations"
    if (href === "/reports") return pathname === "/reports"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Group primary items by category
  const categories = Array.from(
    new Set(primary.map((item) => item.category ?? "General"))
  )

  return (
    <aside className="hidden h-full w-64 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center border-b px-5">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
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
        </Link>
      </div>

      <nav
        aria-label="Admin primary navigation"
        className="flex-1 space-y-4 overflow-y-auto p-3"
      >
        {primary.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            No sections configured.
          </p>
        ) : (
          categories.map((category) => {
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
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
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
          })
        )}
      </nav>

      {utility.length > 0 ? (
        <div className="border-t bg-muted/20 p-3">
          <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Administration
          </div>
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
                    "group flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
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
          </nav>
        </div>
      ) : null}
    </aside>
  )
}
