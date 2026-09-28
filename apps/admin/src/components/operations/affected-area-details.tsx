"use client"

import Link from "next/link"
import { ArrowLeft, MapPin, Trash2 } from "lucide-react"

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
import { useAffectedArea } from "@/hooks/operations/use-affected-areas"

import { severityBadgeClass } from "./badges"

export function AffectedAreaDetails({ areaId }: { areaId: number }) {
  const { area, isLoading, remove } = useAffectedArea(areaId)

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading affected area...
      </div>
    )
  }

  if (!area) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Affected area #{areaId} not found.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.affectedAreas.list} />}
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
          render={<Link href={adminRoutes.operations.affectedAreas.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Affected Areas
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => remove.mutate(areaId)}
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
                <MapPin className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Affected Area #{area.area_id}
                </CardTitle>
                <CardDescription>
                  {area.disaster_name || `Disaster #${area.disaster_id}`}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={severityBadgeClass(area.severity)}
            >
              {area.severity}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Affected Population
            </p>
            <p className="text-2xl font-bold">
              {Number(area.affected_population).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Location ID
            </p>
            <p className="font-mono text-lg">
              {area.location_id ? `Loc #${area.location_id}` : "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Disaster ID
            </p>
            <p className="font-mono text-lg">#{area.disaster_id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Created At
            </p>
            <p className="font-mono text-sm">
              {area.created_at
                ? new Date(area.created_at).toLocaleString()
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
