"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Flame, ShieldAlert, RefreshCw } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shurokkha/ui/components/table"

import { getApiBaseUrl } from "@/lib/api"
import { formatDateTime } from "@/features/shared/formatters"

interface CriticalAlertItem {
  alert_id: string
  alert_type: "Citizen Emergency" | "National Disaster"
  alert_severity: string
  alert_time: string
  current_status: string
}

export function CriticalAlertsFeed() {
  const [alerts, setAlerts] = useState<CriticalAlertItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError(null)
      const baseUrl = getApiBaseUrl()
      const res = await fetch(`${baseUrl}/v1/core/union`)
      if (!res.ok) {
        throw new Error(`Failed to load alerts: ${res.statusText}`)
      }
      const json = await res.json()
      setAlerts(json.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load alerts feed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  return (
    <Card className="border-danger/30 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <Flame className="size-4" />
            </span>
            <CardTitle className="text-xl font-bold tracking-tight">
              Unified Critical Alerts Feed
            </CardTitle>
            <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider">
              Live Feed
            </Badge>
          </div>
          <CardDescription>
            Chronological aggregation combining severe national disasters and critical citizen emergency calls into a unified feed.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAlerts}
          disabled={loading}
          className="gap-1.5"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
            Loading critical alerts...
          </div>
        ) : error ? (
          <div className="py-6 text-center text-sm text-danger">
            {error}
          </div>
        ) : alerts.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No active critical alerts right now.
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Alert ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity / Priority</TableHead>
                  <TableHead>Reported Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.alert_id}>
                    <TableCell className="font-mono text-xs font-semibold">
                      {alert.alert_id}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        {alert.alert_type === "National Disaster" ? (
                          <ShieldAlert className="size-4 text-warning" />
                        ) : (
                          <AlertCircle className="size-4 text-danger" />
                        )}
                        {alert.alert_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          alert.alert_severity.toLowerCase() === "critical"
                            ? "destructive"
                            : "warning"
                        }
                      >
                        {alert.alert_severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(alert.alert_time)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {alert.current_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
