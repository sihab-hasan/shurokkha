"use client"

import { useState } from "react"
import {
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle2,
  Navigation,
  AlertCircle,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Button } from "@shurokkha/ui/components/button"
import { Label } from "@shurokkha/ui/components/label"
import { Badge } from "@shurokkha/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shurokkha/ui/components/table"
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { useOperationsData } from "../hooks/use-operations"

export function TeamManagementTab() {
  const { assignments, rescueTeams, emergencyRequests } = useOperationsData()

  const [teamId, setTeamId] = useState<string>("")
  const [requestId, setRequestId] = useState<string>("")
  const [status, setStatus] = useState<
    "assigned" | "on_route" | "completed" | "cancelled"
  >("assigned")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedTeam = parseInt(
      teamId || String(rescueTeams.data[0]?.team_id || 1),
      10
    )
    const parsedRequest = parseInt(
      requestId || String(emergencyRequests[0]?.request_id || 1),
      10
    )

    if (!parsedTeam || !parsedRequest) return

    assignments.create.mutate({
      team_id: parsedTeam,
      request_id: parsedRequest,
      status,
    })
  }

  const getStatusBadge = (st: string) => {
    switch (st?.toLowerCase()) {
      case "completed":
        return (
          <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-3" /> Completed
          </Badge>
        )
      case "on_route":
        return (
          <Badge className="gap-1 border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-400">
            <Navigation className="size-3" /> On Route
          </Badge>
        )
      case "assigned":
        return (
          <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400">
            Assigned
          </Badge>
        )
      case "cancelled":
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Cancelled
          </Badge>
        )
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Input Form */}
      <div className="lg:col-span-4">
        <Card className="sticky top-24 border-primary/20 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <ClipboardList className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Assign Team to Mission
                </CardTitle>
                <CardDescription>
                  Insert record into{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    team_management
                  </code>{" "}
                  table
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team_id">Select Rescue Team *</Label>
                <NativeSelect
                  id="team_id"
                  value={teamId || String(rescueTeams.data[0]?.team_id || "")}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="w-full"
                  required
                >
                  {rescueTeams.data.map((t) => (
                    <option key={t.team_id} value={t.team_id}>
                      #{t.team_id} - {t.team_name} ({t.availability})
                    </option>
                  ))}
                  {rescueTeams.data.length === 0 && (
                    <option value="1">#1 - Dhaka Fire Service Alpha</option>
                  )}
                </NativeSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="request_id">Target Emergency Request *</Label>
                <NativeSelect
                  id="request_id"
                  value={
                    requestId || String(emergencyRequests[0]?.request_id || "")
                  }
                  onChange={(e) => setRequestId(e.target.value)}
                  className="w-full"
                  required
                >
                  {emergencyRequests.map((r) => (
                    <option key={r.request_id} value={r.request_id}>
                      Req #{r.request_id} - {r.citizen_name || "Citizen"} (
                      {r.priority.toUpperCase()})
                    </option>
                  ))}
                  {emergencyRequests.length === 0 && (
                    <option value="1">
                      Req #1 - Critical Rescue (Area #1)
                    </option>
                  )}
                </NativeSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Initial Assignment Status *</Label>
                <NativeSelect
                  id="status"
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as
                        "assigned" | "on_route" | "completed" | "cancelled"
                    )
                  }
                  className="w-full"
                >
                  <option value="assigned">Assigned</option>
                  <option value="on_route">On Route</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </NativeSelect>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={assignments.create.isPending}
              >
                <Plus className="size-4" />
                {assignments.create.isPending
                  ? "Assigning..."
                  : "Create Team Assignment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Live Table */}
      <div className="space-y-4 lg:col-span-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span>Team Assignments Live Table</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {assignments.data.length} assignments
                </Badge>
              </CardTitle>
              <CardDescription>
                Emergency request dispatches and active rescue missions
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-16">Assign ID</TableHead>
                    <TableHead>Assigned Team</TableHead>
                    <TableHead>Emergency Request</TableHead>
                    <TableHead>Status & Quick Change</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Loading team assignments...
                      </TableCell>
                    </TableRow>
                  ) : assignments.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No team assignments found in database. Create one on the
                        left!
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.data.map((row) => (
                      <TableRow
                        key={row.assignment_id}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="font-mono text-xs font-medium">
                          #{row.assignment_id}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {row.team_name || `Team #${row.team_id}`}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ID: {row.team_id}{" "}
                            {row.team_type ? `• ${row.team_type}` : ""}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              Req #{row.request_id}
                            </span>
                            {row.request_priority && (
                              <Badge
                                variant="outline"
                                className={
                                  row.request_priority === "critical"
                                    ? "bg-destructive/10 text-[10px] text-destructive"
                                    : "text-[10px]"
                                }
                              >
                                {row.request_priority}
                              </Badge>
                            )}
                          </div>
                          {row.citizen_name && (
                            <div className="text-xs text-muted-foreground">
                              {row.citizen_name}{" "}
                              {row.citizen_phone
                                ? `(${row.citizen_phone})`
                                : ""}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <NativeSelect
                              value={row.status}
                              onChange={(e) =>
                                assignments.updateStatus.mutate({
                                  id: row.assignment_id,
                                  status: e.target.value,
                                })
                              }
                              className="h-8 py-0 text-xs"
                            >
                              <option value="assigned">Assigned</option>
                              <option value="on_route">On Route</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </NativeSelect>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              assignments.remove.mutate(row.assignment_id)
                            }
                            disabled={assignments.remove.isPending}
                            title="Delete Assignment"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
