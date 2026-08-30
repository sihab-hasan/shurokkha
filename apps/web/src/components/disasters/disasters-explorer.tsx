"use client"

import * as React from "react"
import {
  AlertTriangle,
  Calendar,
  Clock,
  Filter,
  Flame,
  LifeBuoy,
  Radio,
  Search,
  ShieldAlert,
  Waves,
} from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Input } from "@shurokkha/ui/components/input"
import { WidgetFrame } from "@shurokkha/ui-patterns/dashboard"

export interface DisasterRecord {
  disaster_id: number
  disaster_name: string
  severity: "Critical" | "High" | "Medium" | "Low" | string
  status: "active" | "warning" | "contained" | "resolved" | string
  start_datetime: string
}

const DEFAULT_DISASTERS: DisasterRecord[] = [
  {
    disaster_id: 1,
    disaster_name: "Sylhet Flash Flood 2026",
    severity: "Critical",
    status: "active",
    start_datetime: "2026-06-15 08:30:00",
  },
  {
    disaster_id: 2,
    disaster_name: "Bay of Bengal Super Cyclone",
    severity: "High",
    status: "active",
    start_datetime: "2026-07-02 14:00:00",
  },
  {
    disaster_id: 3,
    disaster_name: "Kurigram Riverbank Erosion",
    severity: "Medium",
    status: "contained",
    start_datetime: "2026-05-20 10:15:00",
  },
  {
    disaster_id: 4,
    disaster_name: "Chittagong Hill Tracts Landslide",
    severity: "Critical",
    status: "resolved",
    start_datetime: "2026-04-10 06:45:00",
  },
]

export function DisastersExplorer() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [severityFilter, setSeverityFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredDisasters = React.useMemo(() => {
    return DEFAULT_DISASTERS.filter((item) => {
      const matchesSearch = item.disaster_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesSeverity =
        severityFilter === "all" ||
        item.severity.toLowerCase() === severityFilter.toLowerCase()
      const matchesStatus =
        statusFilter === "all" ||
        item.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesSeverity && matchesStatus
    })
  }, [searchQuery, severityFilter, statusFilter])

  const totalCritical = DEFAULT_DISASTERS.filter(
    (d) => d.severity === "Critical"
  ).length
  const totalActive = DEFAULT_DISASTERS.filter(
    (d) => d.status === "active"
  ).length

  function getSeverityBadge(severity: string) {
    switch (severity.toLowerCase()) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return (
          <Badge className="bg-amber-600 text-white hover:bg-amber-700">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
            Medium
          </Badge>
        )
      default:
        return <Badge variant="secondary">Low</Badge>
    }
  }

  function getStatusBadge(status: string) {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Active
          </span>
        )
      case "warning":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Warning
          </span>
        )
      case "contained":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span className="size-1.5 rounded-full bg-blue-500" />
            Contained
          </span>
        )
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
            Resolved
          </span>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Overview Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Logged Disasters
            </CardTitle>
            <ShieldAlert className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DEFAULT_DISASTERS.length}</div>
            <p className="text-xs text-muted-foreground">
              Across verified response sectors
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Crisis Incidents
            </CardTitle>
            <Radio className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalActive}
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time response active
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Severity
            </CardTitle>
            <AlertTriangle className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {totalCritical}
            </div>
            <p className="text-xs text-muted-foreground">
              Urgent evacuation & relief
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ERD Entities Schema
            </CardTitle>
            <Waves className="size-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
              Table 3
            </div>
            <p className="text-xs text-muted-foreground">
              disasters (MySQL 1:M affected_areas)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search disaster by title or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <span>Severity:</span>
          </div>
          {["all", "critical", "high", "medium"].map((sev) => (
            <Button
              key={sev}
              size="sm"
              variant={severityFilter === sev ? "default" : "outline"}
              className="h-8 text-xs capitalize"
              onClick={() => setSeverityFilter(sev)}
            >
              {sev}
            </Button>
          ))}

          <div className="ml-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Status:</span>
          </div>
          {["all", "active", "contained", "resolved"].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={statusFilter === st ? "secondary" : "ghost"}
              className="h-8 text-xs capitalize"
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* Disasters Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredDisasters.map((disaster) => (
          <Card
            key={disaster.disaster_id}
            className="transition-all duration-200 hover:border-primary/40 hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      ID #{disaster.disaster_id}
                    </span>
                    {getSeverityBadge(disaster.severity)}
                  </div>
                  <CardTitle className="text-lg font-bold">
                    {disaster.disaster_name}
                  </CardTitle>
                </div>
                <div>{getStatusBadge(disaster.status)}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  Started: {disaster.start_datetime.split(" ")[0]}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {disaster.start_datetime.split(" ")[1]}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-xs text-muted-foreground">
                  DB Table: <code className="font-mono">disasters</code>
                </span>
                <a
                  href="/get-help"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <LifeBuoy className="size-3.5" />
                  Request Assistance
                </a>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDisasters.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No disaster incidents found matching your filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
