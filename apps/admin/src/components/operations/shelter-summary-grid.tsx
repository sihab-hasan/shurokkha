"use client"

import { Home } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Card, CardContent } from "@shurokkha/ui/components/card"

import { useShelterSummaryView } from "@/hooks/operations/use-reports"

import { statusBadgeClass } from "./badges"

export function ShelterSummaryGrid() {
  const query = useShelterSummaryView()
  const data = query.data ?? []
  const isLoading = query.isLoading

  if (isLoading) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Loading shelter summary...
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        No shelter summary data.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((row) => {
        const pct = row.capacity
          ? Math.min(100, Math.round((row.occupancy / row.capacity) * 100))
          : 0
        return (
          <Card key={row.shelter_id} className="border-primary/20 shadow-sm">
            <CardContent className="space-y-3 py-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Home className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{row.shelter_name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      #{row.shelter_id}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={statusBadgeClass(row.status)}
                >
                  {row.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Occupancy</span>
                  <span className="font-mono">
                    {row.occupancy.toLocaleString()} /{" "}
                    {row.capacity.toLocaleString()} ({pct}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
