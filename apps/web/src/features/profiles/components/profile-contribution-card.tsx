import { HandHeart, PackageCheck } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@shurokkha/ui/components/card"

import { ProfileContributionRow } from "./profile-contribution-row"

import type { PublicProfileRecord } from "@shurokkha/contracts"

interface ProfileContributionCardProps {
  profile: PublicProfileRecord
}

/**
 * Sidebar card on `/u/{username}` summarising the public-approved
 * contribution metrics. Lives next to the about card on lg+ screens.
 */
export function ProfileContributionCard({
  profile,
}: ProfileContributionCardProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Public contribution</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          A snapshot of approved contributions visible on the public
          profile. Private activity never appears here.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <ProfileContributionRow
          icon={<HandHeart className="size-4 text-primary" />}
          label="Donations recorded"
          value={profile.metrics.donations}
        />
        <ProfileContributionRow
          icon={<PackageCheck className="size-4 text-primary" />}
          label="Assistance requests submitted"
          value={profile.metrics.assistance_requests}
        />
      </CardContent>
    </Card>
  )
}
