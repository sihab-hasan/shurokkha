import {
  Clock3,
  HandHeart,
  LifeBuoy,
  MapPin,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@shurokkha/ui/components/card"

import { ProfileStatTile } from "./profile-stat-tile"

import type { PublicProfileRecord } from "@shurokkha/contracts"

interface ProfileAboutCardProps {
  profile: PublicProfileRecord
}

/**
 * Public "About" card on `/u/{username}`. Renders the bio plus a 2x2
 * grid of stat tiles (location, joined, donations, assistance).
 *
 * The bio fallback keeps the card informative even for accounts that
 * haven't filled out their profile — explaining the empty state in
 * place rather than hiding it.
 */
export function ProfileAboutCard({ profile }: ProfileAboutCardProps) {
  const joinedLabel = profile.joined_at
    ? new Date(profile.joined_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently"

  return (
    <Card className="gap-0 py-0 shadow-xs">
      <CardHeader className="px-5 pt-5 sm:px-8 sm:pt-6">
        <CardTitle>About</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          {profile.bio ??
            "This member hasn't shared a public bio yet. They can edit it from their account settings."}
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 py-6 sm:grid-cols-2 sm:px-8">
        <ProfileStatTile
          icon={<MapPin className="size-5" aria-hidden />}
          label="Location"
          value={profile.location ?? "Not shared"}
        />
        <ProfileStatTile
          icon={<Clock3 className="size-5" aria-hidden />}
          label="Joined"
          value={joinedLabel}
        />
        <ProfileStatTile
          icon={<HandHeart className="size-5" aria-hidden />}
          label="Donations recorded"
          value={String(profile.metrics.donations)}
        />
        <ProfileStatTile
          icon={<LifeBuoy className="size-5" aria-hidden />}
          label="Assistance requests"
          value={String(profile.metrics.assistance_requests)}
        />
      </CardContent>
    </Card>
  )
}
