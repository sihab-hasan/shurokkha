"use client"

import { AlertCircle, Info, Megaphone } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { toast } from "@shurokkha/ui/components/sonner"

import { useQuery } from "@tanstack/react-query"
import { getShurokkhaApi } from "@/lib/api"

import type { AlertRecord } from "@shurokkha/contracts"

function severityVariant(severity: AlertRecord["severity"]) {
  switch (severity) {
    case "critical":
      return "destructive" as const
    case "warning":
      return "default" as const
    default:
      return "secondary" as const
  }
}

function severityIcon(severity: AlertRecord["severity"]) {
  if (severity === "critical") return <AlertCircle className="size-4" />
  if (severity === "warning") return <Megaphone className="size-4" />
  return <Info className="size-4" />
}

export function NotificationsClient() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["account", "notifications"],
    queryFn: async () => {
      const res = await getShurokkhaApi().public.alerts.list()
      return res.data ?? []
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (isError) {
    toast.error(
      error instanceof Error ? error.message : "Failed to load notifications."
    )
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Could not load notifications.
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">No active alerts</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          There are no active disaster alerts right now. You'll see the latest
          ones here as they are issued.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((alert) => (
        <Card key={alert.alert_id}>
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div className="flex items-start gap-3">
              <div className="mt-1">{severityIcon(alert.severity)}</div>
              <div>
                <CardTitle className="text-base">{alert.title}</CardTitle>
                {alert.disaster_name ? (
                  <p className="text-xs text-muted-foreground">
                    Tied to {alert.disaster_name}
                  </p>
                ) : null}
              </div>
            </div>
            <Badge variant={severityVariant(alert.severity)}>
              {alert.severity}
            </Badge>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{alert.message}</p>
            {alert.area_description ? (
              <p className="mt-2 text-xs">Area: {alert.area_description}</p>
            ) : null}
            {alert.expires_at ? (
              <p className="mt-1 text-xs">
                Expires {new Date(alert.expires_at).toLocaleString()}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
