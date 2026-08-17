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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shurokkha/ui/components/tooltip"

import { ThemeSwitcher } from "@shurokkha/ui/components/theme-switcher"
import { appRoleMeta, type AppRole } from "@/config/app-navigation"
import { cn } from "@shurokkha/ui/lib/utils"

export default function AppHeader({ role }: { role: AppRole }) {
  const roleMeta = appRoleMeta[role]
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
        {/* Sidebar toggle — collapses to icon rail, persists via cookie (⌘/Ctrl+B) */}
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

      {/* Center — anchored to the true horizontal center of the header. */}
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

      {/* Right — theme, alerts, messages, notifications, and profile. */}
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
                  render={<Link href={`/${role}/alerts`} />}
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
                  render={<Link href={`/${role}/messages`} />}
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
                  render={<Link href={`/${role}/notifications`} />}
                >
                  <FaRegBell />
                  <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-card" />
                </Button>
              }
            />
            <TooltipContent side="bottom">Notifications</TooltipContent>
          </Tooltip>
        </div>

        <div className="ml-1 flex items-center gap-3 pl-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
            {roleMeta.label.charAt(0)}
          </div>
          <div className="hidden min-w-24 text-left leading-tight sm:grid">
            <span className="truncate text-sm font-semibold">
              {roleMeta.label}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {roleMeta.userName}
            </span>
          </div>
        </div>
      </div>
    </WorkspaceShellHeader>
  )
}
