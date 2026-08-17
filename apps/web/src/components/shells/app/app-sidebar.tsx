"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { ChevronRight, LogOut, Settings, UserRound, X } from "lucide-react"

import { appNavigation, type AppRole } from "@/config/app-navigation"
import { routes } from "@/config/routes"
import { cn } from "@shurokkha/ui/lib/utils"
import { WorkspaceShellSidebar } from "@shurokkha/ui-patterns/layout"
import { Button } from "@shurokkha/ui/components/button"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@shurokkha/ui/components/sidebar"

export default function AppSidebar({ role }: { role: AppRole }) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const appBase = `/${role}`
  const profileHref = `${appBase}/profile`
  const allModules = appNavigation[role]

  const activeModuleId = React.useMemo(() => {
    const segments = pathname.replace(appBase, "").split("/").filter(Boolean)
    return segments[0] || "overview"
  }, [pathname, appBase])

  // Which module's sub-items are expanded. Starts as whatever module the current route is in;
  // stays in sync as the user navigates, but the user can also manually expand a sibling
  // to look ahead without leaving their current page.
  const [expandedModuleId, setExpandedModuleId] = React.useState<string | null>(
    activeModuleId
  )

  // Adjust state during render instead of in an effect — avoids the extra
  // render-then-sync pass that `useEffect` causes. `prevActiveModuleId` tracks
  // the last route-derived value we synced from, so a manual toggle (via the
  // button's onClick below) isn't immediately clobbered on the next render.
  const [prevActiveModuleId, setPrevActiveModuleId] =
    React.useState(activeModuleId)
  if (activeModuleId !== prevActiveModuleId) {
    setPrevActiveModuleId(activeModuleId)
    setExpandedModuleId(activeModuleId)
  }

  React.useEffect(() => {
    if (isMobile) setOpenMobile(false)
  }, [isMobile, pathname, setOpenMobile])

  return (
    <WorkspaceShellSidebar collapsible="icon">
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

      {/* Navigation — one module per row, sub-items accordion under the active/expanded one */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {allModules.map((module) => {
              const fullModuleHref = `${appBase}${module.href}`
              const isRouteActive = activeModuleId === module.id
              const isExpanded = expandedModuleId === module.id
              const hasSubItems =
                module.sections.some((s) => s.items.length > 1) ||
                module.sections.length > 1

              return (
                <SidebarMenuItem key={module.id}>
                  <SidebarMenuButton
                    isActive={isRouteActive}
                    tooltip={module.label}
                    className="h-10 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5! [&_svg]:size-5"
                    render={<Link href={fullModuleHref} />}
                    onClick={() => {
                      // If it has sub-items, toggle the accordion instead of just re-navigating.
                      if (hasSubItems) {
                        setExpandedModuleId((current) =>
                          current === module.id ? null : module.id
                        )
                      }
                    }}
                  >
                    <module.icon />
                    <span>{module.label}</span>
                    {hasSubItems && (
                      <ChevronRight
                        className={cn(
                          "ml-auto size-3.5 shrink-0 transition-transform duration-150 group-data-[collapsible=icon]:hidden",
                          isExpanded && "rotate-90"
                        )}
                      />
                    )}
                  </SidebarMenuButton>

                  {hasSubItems && isExpanded && (
                    <SidebarMenuSub>
                      {module.sections.flatMap((section) =>
                        section.items.map((item) => {
                          const fullHref = `${appBase}${item.href}`
                          const isItemActive =
                            pathname === fullHref ||
                            pathname.startsWith(`${fullHref}/`)

                          return (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton
                                isActive={isItemActive}
                                render={<Link href={fullHref} />}
                              >
                                <item.icon />
                                <span>{item.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })
                      )}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
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
              isActive={pathname === `${appBase}/settings`}
              tooltip="Settings"
              className="h-10 rounded-md group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5! [&_svg]:size-5"
              render={<Link href={`${appBase}/settings`} />}
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              className="h-10 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5! [&_svg]:size-5"
              render={<Link href={routes.auth.signOut} />}
            >
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </WorkspaceShellSidebar>
  )
}
