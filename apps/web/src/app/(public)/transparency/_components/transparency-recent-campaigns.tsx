"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"

import { usePublicFundraises } from "@/app/(public)/transparency/_hooks/use-public-fundraises"

export function TransparencyRecentCampaigns() {
  const { data, isLoading } = usePublicFundraises({ status: "active" })

  const campaigns = data?.data ?? []

  return (
    <div className="space-y-3">
      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading campaigns…
          </CardContent>
        </Card>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No active campaigns right now. New campaigns appear here as soon as
            the coordination team approves them.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {campaigns
            .slice(0, 4)
            .map(
              (campaign: {
                fundraise_id: number
                title: string
                beneficiary_name: string | null
                goal_amount: number
                raised_amount: number
                currency: string
                slug: string
              }) => {
                const pct =
                  campaign.goal_amount > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (campaign.raised_amount / campaign.goal_amount) * 100
                        )
                      )
                    : 0
                return (
                  <Card key={campaign.fundraise_id}>
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{campaign.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {campaign.beneficiary_name ??
                              "Verified beneficiary"}
                          </p>
                        </div>
                        <Badge variant="outline">{pct}%</Badge>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {campaign.raised_amount.toLocaleString()} /{" "}
                          {campaign.goal_amount.toLocaleString()}{" "}
                          {campaign.currency}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          nativeButton={false}
                          render={<Link href={`/fundraise/${campaign.slug}`} />}
                        >
                          Details <ArrowRight className="size-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              }
            )}
        </div>
      )}
    </div>
  )
}
