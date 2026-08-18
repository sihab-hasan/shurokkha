"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { buttonVariants } from "@shurokkha/ui/components/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@shurokkha/ui/components/sheet"
import { cn } from "@shurokkha/ui/lib/utils"

import { AccountMenu } from "@/components/auth/account-menu"
import { useAuth } from "@/components/auth/auth-provider"
import { BrandLogo } from "@/components/brand/brand-logo"
import { publicSiteConfig } from "@/config/public-site-config"
import { routes } from "@/config/routes"

function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)
}

export default function PublicSidebar() {
  const pathname = usePathname()
  const { status, user } = useAuth()
  const getHelpHref =
    status === "authenticated" && user?.role === "citizen"
      ? routes.citizen.requestHelp
      : routes.public.getHelp

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label="Open navigation"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "xl:hidden"
            )}
          />
        }
      >
        <Menu />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-[min(22rem,90vw)] flex-col gap-0 p-0"
      >
        <SheetHeader className="rounded-b-xl bg-muted/55 p-6">
          <SheetTitle className="text-left">
            <BrandLogo />
          </SheetTitle>
          <SheetDescription className="max-w-xs text-left leading-6">
            Trusted disaster information, assistance routes, shelters, and ways
            to support recovery.
          </SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile navigation" className="flex flex-col gap-1 p-4">
          {publicSiteConfig.navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href)

            return (
              <SheetClose
                key={item.href}
                nativeButton={false}
                render={
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({
                        variant: isActive ? "secondary" : "ghost",
                      }),
                      "w-full justify-start rounded-xl"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  />
                }
              >
                {item.label}
              </SheetClose>
            )
          })}
        </nav>

        <div className="mx-4 mt-auto mb-4 space-y-4 rounded-xl bg-muted/55 p-4">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Account
            </p>
            <AccountMenu showIdentity />
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Emergency tools
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {publicSiteConfig.utilityItems.map((item) => (
                <SheetClose
                  key={item.href}
                  nativeButton={false}
                  render={
                    <Link
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "rounded-md"
                      )}
                    />
                  }
                >
                  {item.label}
                </SheetClose>
              ))}
            </div>
            <SheetClose
              nativeButton={false}
              render={
                <Link
                  href={getHelpHref}
                  className={cn(buttonVariants(), "w-full")}
                />
              }
            >
              Get help
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
