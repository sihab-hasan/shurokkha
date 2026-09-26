"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { LogOut, Settings, UserRound, X } from "lucide-react"

import { accountNavigationModules } from "@/config/app-navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { routes } from "@/config/routes"
import { filterNavForRole } from "@/lib/rbac"
import { Button } from "@shurokkha/ui/components/button"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  Sidebar,
  useSidebar,
} from "@shurokkha/ui/components/sidebar"

export default function AccountSidebar({ role }: { role?: string } = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut, user } = useAuth()
  const { isMobile, setOpenMobile } = useSidebar()

  const profileHref = routes.account.profile
  const settingsHref = routes.account.settings

  const userRole = user?.role
  const allModules = filterNavForRole(accountNavigationModules, userRole)

  const activeModuleId = React.useMemo(() => {
    const segments = pathname.replace("/account", "").split("/").filter(Boolean)
    return segments[0] || "dashboard"
  }, [pathname])

  React.useEffect(() => {
    if (isMobile) setOpenMobile(false)
  }, [isMobile, pathname, setOpenMobile])

  const categories = Array.from(
    new Set(allModules.map((m) => m.category).filter(Boolean))
  ) as string[]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="md:hidden">
        <div className="flex h-10 items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close sidebar"
            onClick={() => setOpenMobile(false)}
          >
            <X />
          </Button>
        </div>
      </SidebarHeader>

      {/* Navigation — organized in category groups */}
      <SidebarContent>
        {categories.map((cat) => {
          const categoryModules = allModules.filter((m) => m.category === cat)

          return (
            <SidebarGroup key={cat}>
              <SidebarGroupLabel>{cat}</SidebarGroupLabel>
              <SidebarMenu>
                {categoryModules.map((module) => {
                  const fullModuleHref = module.href
                  const isRouteActive = activeModuleId === module.id

                  return (
                    <SidebarMenuItem key={module.id}>
                      <SidebarMenuButton
                        isActive={isRouteActive}
                        tooltip={module.label}
                        className="h-10 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5! [&_svg]:size-5"
                        render={<Link href={fullModuleHref} />}
                      >
                        <module.icon />
                        <span>{module.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      {/* Footer — account navigation */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === profileHref}
              tooltip="Profile"
              className="h-10 rounded-md group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5! [&_svg]:size-5"
              render={<Link href={profileHref} />}
            >
              <UserRound />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={
                pathname.startsWith("/account/settings") ||
                pathname === settingsHref
              }
              tooltip="Settings"
              className="h-10 rounded-md group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5! [&_svg]:size-5"
              render={<Link href={settingsHref} />}
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              className="h-10 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5! [&_svg]:size-5"
              onClick={() => {
                void signOut()
                  .then(() => {
                    router.replace(routes.home)
                    router.refresh()
                  })
                  .catch(() => undefined)
              }}
            >
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
