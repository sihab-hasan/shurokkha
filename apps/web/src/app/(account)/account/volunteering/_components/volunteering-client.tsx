"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { Badge } from "@shurokkha/ui/components/badge"

import { useQuery } from "@tanstack/react-query"
import { getShurokkhaApi } from "@/lib/api"

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  approved: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  rejected: "border-destructive/30 bg-destructive/15 text-destructive",
}

export function VolunteeringClient() {
  const { data, isLoading } = useQuery({
    queryKey: ["account", "volunteer"],
    queryFn: async () => {
      const res = await getShurokkhaApi().account.volunteer.show()
      return res.data
    },
  })

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">No volunteer record yet</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Apply to volunteer. Once approved, you&apos;ll appear in the
          coordination team&apos;s volunteer pool and may be assigned to
          missions.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{data.full_name}</CardTitle>
          <Badge
            variant="outline"
            className={
              STATUS_STYLES[data.status] ??
              "border-muted-foreground/30 bg-muted text-muted-foreground"
            }
          >
            {data.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Phone
          </p>
          <p className="font-mono">{data.phone}</p>
        </div>
        {data.email ? (
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Email
            </p>
            <p className="font-mono">{data.email}</p>
          </div>
        ) : null}
        {data.address ? (
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Address
            </p>
            <p>{data.address}</p>
          </div>
        ) : null}
        {data.skills ? (
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Skills
            </p>
            <p>{data.skills}</p>
          </div>
        ) : null}
        {data.availability ? (
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Availability
            </p>
            <p>{data.availability}</p>
          </div>
        ) : null}
        {data.motivation ? (
          <div className="sm:col-span-2">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Motivation
            </p>
            <p className="whitespace-pre-line">{data.motivation}</p>
          </div>
        ) : null}
        {data.review_notes ? (
          <div className="rounded bg-muted/40 p-3 text-xs text-muted-foreground sm:col-span-2">
            <span className="font-semibold">Review notes:</span>{" "}
            {data.review_notes}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
