"use client"

import Link from "next/link"
import { ArrowLeft, Megaphone, Trash2 } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

import { adminRoutes } from "@/config/routes"
import { useAlert } from "@/hooks/operations/use-alerts"

import { severityBadgeClass, statusBadgeClass } from "./badges"

export function AlertDetails({ alertId }: { alertId: number }) {
  const { alert, isLoading, remove } = useAlert(alertId)

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading alert...
      </div>
    )
  }

  if (!alert) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Alert #{alertId} not found.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.alerts.list} />}
          >
            <ArrowLeft className="size-4" /> Back to list
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={adminRoutes.operations.alerts.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Alerts
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => remove.mutate(alertId)}
          disabled={remove.isPending}
        >
          <Trash2 className="size-4" /> Delete
        </Button>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Megaphone className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{alert.title}</CardTitle>
                <CardDescription>Alert #{alert.alert_id}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={severityBadgeClass(alert.severity)}
              >
                {alert.severity}
              </Badge>
              <Badge
                variant="outline"
                className={statusBadgeClass(alert.status)}
              >
                {alert.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Message
            </p>
            <p className="mt-1 text-sm whitespace-pre-line">{alert.message}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Disaster
              </p>
              <p className="text-sm">
                {alert.disaster_name ||
                  (alert.disaster_id
                    ? `Disaster #${alert.disaster_id}`
                    : "Platform-wide")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Area Description
              </p>
              <p className="text-sm">{alert.area_description || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Created
              </p>
              <p className="font-mono text-sm">
                {alert.created_at
                  ? new Date(alert.created_at).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Expires
              </p>
              <p className="font-mono text-sm">
                {alert.expires_at
                  ? new Date(alert.expires_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
