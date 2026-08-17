"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@shurokkha/ui/components/badge"
import { cn } from "@shurokkha/ui/lib/utils"

import { docsNavigation } from "@/config/docs-navigation"

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="space-y-4">
      <nav
        aria-label="Documentation navigation"
        className="rounded-xl border bg-card p-3"
      >
        <div className="px-2 pb-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Documentation
        </div>
        <div className="space-y-1">
          {docsNavigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="rounded-xl border bg-muted/20 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold">Package boundary</span>
          <Badge variant="outline">Rule</Badge>
        </div>
        <code className="mt-3 block text-xs leading-6 text-muted-foreground">
          apps → ui-patterns → ui
        </code>
      </div>
    </aside>
  )
}
