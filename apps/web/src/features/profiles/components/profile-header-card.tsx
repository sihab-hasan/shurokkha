import { CalendarDays, MapPin } from "lucide-react"

import { Avatar, AvatarFallback } from "@shurokkha/ui/components/avatar"
import { Badge } from "@shurokkha/ui/components/badge"
import { Card, CardContent, CardHeader } from "@shurokkha/ui/components/card"

import type { PublicProfileRecord } from "@shurokkha/contracts"

interface ProfileHeaderCardProps {
  profile: PublicProfileRecord
}

/**
 * Hero header for `/u/{username}`. Renders the gradient banner,
 * circular avatar with initials fallback, name + verified-meta line,
 * and the location + joined date strip.
 *
 * The role label is computed from `profile.role` so the helper stays
 * the single place role strings are translated to user-facing copy.
 */
export function ProfileHeaderCard({ profile }: ProfileHeaderCardProps) {
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const roleLabel = profile.role === "admin" ? "Administrator" : "Citizen"

  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-xs">
      <div className="h-28 bg-gradient-to-r from-primary/18 via-primary/8 to-secondary/55 sm:h-40" />
      <CardHeader className="relative gap-4 px-5 pt-16 pb-4 sm:px-8 sm:pt-20">
        <Avatar className="absolute -top-14 size-28 ring-4 ring-background sm:-top-16 sm:size-32">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="size-full object-cover"
            />
          ) : (
            <AvatarFallback className="bg-secondary text-2xl font-semibold text-primary">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              @{profile.username}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{roleLabel}</Badge>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden />
              {profile.location ?? "Location not set"}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden />
              {profile.joined_at
                ? `Joined ${new Date(profile.joined_at).toLocaleDateString(
                    "en-US",
                    { month: "long", year: "numeric" }
                  )}`
                : "Recently joined"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 sm:px-8 sm:pb-7">
        <div className="rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Verified community member · Only approved public profile information
          is shown.
        </div>
      </CardContent>
    </Card>
  )
}
