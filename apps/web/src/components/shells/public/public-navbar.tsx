"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { buttonVariants } from "@shurokkha/ui/components/button"
import { ThemeSwitcher } from "@shurokkha/ui/components/theme-switcher"
import { cn } from "@shurokkha/ui/lib/utils"

import { AccountMenu } from "@/components/auth/account-menu"
import { useAuth } from "@/components/auth/auth-provider"
import { BrandLogo } from "@/components/brand/brand-logo"
import { publicSiteConfig } from "@/config/public-site-config"
import { routes } from "@/config/routes"

import { PublicContainer } from "./public-container"
import PublicSidebar from "./public-sidebar"

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)
}

export default function PublicNavbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const { status, user } = useAuth()
  const getHelpHref =
    status === "authenticated"
      ? routes.account?.createAssistance || "/account/assistance/new"
      : routes.public?.getHelp || "/get-help"

  return (
    <header className="sticky top-0 z-40 w-full bg-background/92 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/82">
      <PublicContainer className="flex h-16 items-center gap-5">
        <BrandLogo
          priority
          className="shrink-0 [&>span:first-child]:size-11 [&>span:last-child]:hidden sm:[&>span:last-child]:flex"
        />

        <nav
          aria-label="Primary navigation"
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex"
        >
          {publicSiteConfig.navItems.map((item) => {
            const isActive = mounted && isActivePath(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href={routes.public?.operations || "/operations"}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden border-primary/30 text-primary hover:bg-primary/10 md:inline-flex"
            )}
          >
            Admin Panel
          </Link>

          {mounted ? (
            <>
              <ThemeSwitcher />
              <AccountMenu />
            </>
          ) : (
            <div className="h-9 w-16" />
          )}

          <Link
            href={getHelpHref}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "inline-flex"
            )}
          >
            Get help
          </Link>

          <div className="xl:hidden">
            <PublicSidebar />
          </div>
        </div>
      </PublicContainer>
    </header>
  )
}
