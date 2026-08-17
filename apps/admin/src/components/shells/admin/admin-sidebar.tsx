"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck } from "lucide-react"

import { WorkspaceShellSidebar } from "@shurokkha/ui-patterns/layout"

import {
  adminPrimaryNavigation,
  adminUtilityNavigation,
} from "@/config/admin-navigation"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@shurokkha/ui/components/sidebar"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <WorkspaceShellSidebar collapsible="icon">
      <SidebarHeader className="px-3 py-3 md:hidden">
        <div className="flex items-center gap-2 font-heading font-semibold">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-4" />
          </span>
          Shurokkha Admin
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Command center</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminPrimaryNavigation.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                      className="h-10 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5! [&_svg]:size-5"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {adminUtilityNavigation.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                }
                tooltip={item.label}
                render={<Link href={item.href} />}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </WorkspaceShellSidebar>
  )
}
