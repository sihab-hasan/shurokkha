"use client"

import { useEffect, useState } from "react"
import { Eye, History, RefreshCw, UserCheck } from "lucide-react"

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

interface CitizenHistoryItem {
  user_id: number
  citizen_name: string
  citizen_role: string
  request_id: number
  emergency_type: string
  priority: string
  request_status: string
  disaster_name: string | null
  disaster_severity: string | null
}

export function CitizenEmergencyHistory() {
  const [records, setRecords] = useState<CitizenHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const baseUrl = getApiBaseUrl()
      const res = await fetch(`${baseUrl}/v1/core/view`)
      if (!res.ok) {
        throw new Error(`Failed to load history: ${res.statusText}`)
      }
      const json = await res.json()
      setRecords(json.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load history")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <Card className="mt-8 border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <History className="size-4" />
            </span>
            <CardTitle className="text-xl font-bold tracking-tight">
              Citizen Emergency History
            </CardTitle>
            <Badge variant="secondary" className="font-mono text-xs uppercase">
              Database View
            </Badge>
          </div>
          <CardDescription>
            Comprehensive multi-table record joining Users, Roles, Emergency
            Requests, and Disaster areas.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchHistory}
          disabled={loading}
          className="gap-1.5"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse py-8 text-center text-sm text-muted-foreground">
            Loading emergency history...
          </div>
        ) : error ? (
          <div className="py-6 text-center text-sm text-danger">{error}</div>
        ) : records.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No citizen emergency requests found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Req #</TableHead>
                  <TableHead>Citizen</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Emergency Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Linked Disaster</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((item) => (
                  <TableRow key={item.request_id}>
                    <TableCell className="font-mono text-xs font-semibold">
                      #{item.request_id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="size-3.5 text-muted-foreground" />
                        {item.citizen_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.citizen_role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm capitalize">
                      {item.emergency_type}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.priority.toLowerCase() === "critical"
                            ? "destructive"
                            : item.priority.toLowerCase() === "high"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.request_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {item.disaster_name ? (
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">
                            {item.disaster_name}
                          </p>
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >
                            {item.disaster_severity}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">
                          General / Unlinked
                        </span>
                      )}
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
