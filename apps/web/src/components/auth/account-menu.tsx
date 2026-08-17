"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shurokkha/ui/components/avatar"
import { Button } from "@shurokkha/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shurokkha/ui/components/dropdown-menu"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { cn } from "@shurokkha/ui/lib/utils"

import { useAuth } from "@/components/auth/auth-provider"
import { routes } from "@/config/routes"
import {
  dashboardRouteForUser,
  profileRouteForRole,
  settingsRouteForRole,
} from "@/lib/auth-navigation"

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  )
}

export function AccountMenu({
  showIdentity = false,
  className,
}: {
  showIdentity?: boolean
  className?: string
}) {
  const router = useRouter()
  const { status, user, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (status === "checking") {
    return (
      <div
        className={cn("flex items-center gap-2", className)}
        aria-busy="true"
      >
        <Skeleton className="size-9 rounded-full" />
        {showIdentity ? (
          <Skeleton className="hidden h-8 w-24 sm:block" />
        ) : null}
      </div>
    )
  }

  if (status !== "authenticated" || !user) {
    return (
      <Button
        nativeButton={false}
        variant="ghost"
        size="sm"
        render={<Link href={routes.auth.signIn} />}
        className={className}
      >
        Sign in
      </Button>
    )
  }

  const dashboardHref = dashboardRouteForUser(user)
  const profileHref = profileRouteForRole(user.role)
  const settingsHref = settingsRouteForRole(user.role)

  async function handleSignOut() {
    if (isSigningOut) return
    setIsSigningOut(true)
    try {
      await signOut()
      router.replace(routes.home)
      router.refresh()
    } catch {
      // Keep the current authenticated UI if the server could not end the session.
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Link
        href={dashboardHref}
        aria-label={`Open ${user.role} dashboard`}
        className={cn(
          "flex min-w-0 items-center gap-2 rounded-full p-1",
          "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        )}
      >
        <Avatar className="size-9">
          {user.avatar_url ? (
            <AvatarImage src={user.avatar_url} alt="" />
          ) : null}
          <AvatarFallback className="bg-primary/12 font-semibold text-primary">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>

        {showIdentity ? (
          <span className="hidden min-w-0 text-left leading-tight sm:grid">
            <span className="max-w-32 truncate text-sm font-semibold">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {user.role}
            </span>
          </span>
        ) : null}
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Open account menu"
              className="rounded-full"
            >
              <ChevronDown className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" sideOffset={8} className="w-64">
          <DropdownMenuLabel className="space-y-0.5">
            <span className="block truncate font-medium text-foreground">
              {user.name}
            </span>
            <span className="block truncate">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(dashboardHref)}>
            <LayoutDashboard />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(profileHref)}>
            <CircleUserRound />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(settingsHref)}>
            <Settings />
            Settings
          </DropdownMenuItem>
          {user.role === "citizen" ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(routes.citizen.requests)}
              >
                My requests
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(routes.citizen.missingPersons)}
              >
                Missing persons
              </DropdownMenuItem>
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isSigningOut}
            onClick={() => void handleSignOut()}
          >
            <LogOut />
            {isSigningOut ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
