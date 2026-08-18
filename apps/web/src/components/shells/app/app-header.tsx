"use client"

import Link from "next/link"
import {
  FaBars,
  FaMagnifyingGlass,
  FaRegBell,
  FaRegMessage,
  FaTriangleExclamation,
} from "react-icons/fa6"

import { WorkspaceShellHeader } from "@shurokkha/ui-patterns/layout"
import { Button } from "@shurokkha/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shurokkha/ui/components/input-group"
import { useSidebar } from "@shurokkha/ui/components/sidebar"
import { ThemeSwitcher } from "@shurokkha/ui/components/theme-switcher"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shurokkha/ui/components/tooltip"
import { cn } from "@shurokkha/ui/lib/utils"

import { AccountMenu } from "@/components/auth/account-menu"
import type { AppRole } from "@/config/app-navigation"
import { routes } from "@/config/routes"

export default function AppHeader({ role }: { role: AppRole }) {
  const roleRoutes = routes[role]
  const { state, toggleSidebar } = useSidebar()

  return (
    <WorkspaceShellHeader className="relative border-b-0">
      <div
        className={cn(
          "flex h-full shrink-0 items-center px-4 transition-[width] duration-200 ease-linear md:px-2",
          state === "expanded"
            ? "md:w-(--sidebar-width)"
            : "md:w-(--sidebar-width-icon)"
        )}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="rounded-full"
                aria-label="Toggle sidebar"
                onClick={toggleSidebar}
              >
                <FaBars />
              </Button>
            }
          />
          <TooltipContent side="bottom">Toggle sidebar (Ctrl+B)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="rounded-full lg:hidden"
                aria-label="Search"
              >
                <FaMagnifyingGlass />
              </Button>
            }
          />
          <TooltipContent side="bottom">Search</TooltipContent>
        </Tooltip>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[min(32rem,calc(100vw-50rem))] -translate-x-1/2 items-center lg:flex">
        <form
          role="search"
          className="pointer-events-auto w-full"
          onSubmit={(event) => event.preventDefault()}
        >
          <InputGroup>
            <InputGroupInput
              type="search"
              name="app-search"
              aria-label="Search"
              placeholder="Search..."
            />
            <InputGroupAddon align="inline-start">
              <FaMagnifyingGlass aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 pr-4 sm:pr-6 lg:pr-8">
        <ThemeSwitcher />

        <div className="ml-1 flex items-center gap-1 border-x border-border px-2 lg:px-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  nativeButton={false}
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Emergency alerts"
                  render={<Link href={roleRoutes.alerts} />}
                >
                  <FaTriangleExclamation />
                </Button>
              }
            />
            <TooltipContent side="bottom">Emergency alerts</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  nativeButton={false}
                  variant="secondary"
                  size="icon-lg"
                  className="relative"
                  aria-label="Messages"
                  render={<Link href={roleRoutes.messages} />}
                >
                  <FaRegMessage />
                  <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-card" />
                </Button>
              }
            />
            <TooltipContent side="bottom">Messages</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  nativeButton={false}
                  variant="secondary"
                  size="icon-lg"
                  className="relative"
                  aria-label="Notifications"
                  render={<Link href={roleRoutes.notifications} />}
                >
                  <FaRegBell />
                  <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-card" />
                </Button>
              }
            />
            <TooltipContent side="bottom">Notifications</TooltipContent>
          </Tooltip>
        </div>

        <AccountMenu showIdentity className="ml-1 pl-1" />
      </div>
    </WorkspaceShellHeader>
  )
}
