"use client"

import { useState } from "react"
import { CalendarDays, MapPin, UserCheck, UserPlus } from "lucide-react"

import { VerifiedIcon } from "@shurokkha/icons/verified-icon"
import { Avatar, AvatarFallback } from "@shurokkha/ui/components/avatar"
import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent, CardHeader } from "@shurokkha/ui/components/card"

interface ProfileHeaderProps {
  name: string
  username: string
  role: string
  joined: string
  location: string
}

export function ProfileHeader({
  name,
  username,
  role,
  joined,
  location,
}: ProfileHeaderProps) {
  const [following, setFollowing] = useState(false)
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-xs">
      <div className="h-28 bg-gradient-to-r from-primary/18 via-primary/8 to-secondary/55 sm:h-40" />
      <CardHeader className="relative gap-4 px-5 pt-16 pb-4 sm:px-8 sm:pt-20">
        <Avatar className="absolute -top-14 size-28 ring-4 ring-background sm:-top-16 sm:size-32">
          <AvatarFallback className="bg-secondary text-2xl font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  {name}
                </h1>
                <VerifiedIcon
                  className="size-5 text-primary"
                  aria-label="Verified profile"
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">@{username}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{role}</Badge>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" />
                {location}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden="true" />
                {joined}
              </span>
            </div>
          </div>
          <Button
            className="w-full sm:w-auto"
            variant={following ? "outline" : "default"}
            onClick={() => setFollowing((value) => !value)}
            aria-pressed={following}
          >
            {following ? (
              <UserCheck data-icon="inline-start" />
            ) : (
              <UserPlus data-icon="inline-start" />
            )}
            {following ? "Following" : "Follow"}
          </Button>
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
