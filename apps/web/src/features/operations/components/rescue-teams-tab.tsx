"use client"

import { useState } from "react"
import { ShieldCheck, Plus, Trash2, Users, Activity } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
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

export function RescueTeamsTab() {
  const { rescueTeams } = useOperationsData()

  const [teamName, setTeamName] = useState<string>("")
  const [teamType, setTeamType] = useState<string>("Search and Rescue")
  const [availability, setAvailability] = useState<
    "available" | "busy" | "offline"
  >("available")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) return

    rescueTeams.create.mutate(
      {
        team_name: teamName.trim(),
        team_type: teamType,
        availability,
      },
      {
        onSuccess: () => {
          setTeamName("")
        },
      }
    )
  }

  const getAvailabilityBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return (
          <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            ● Available
          </Badge>
        )
      case "busy":
        return (
          <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400">
            ● Busy on Mission
          </Badge>
        )
      case "offline":
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            ○ Offline
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
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Register Rescue Team</CardTitle>
                <CardDescription>
                  Insert record into{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    rescue_teams
                  </code>{" "}
                  table
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team_name">Team Name / Unit *</Label>
                <Input
                  id="team_name"
                  placeholder="e.g. Sylhet Quick Response Team 4"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team_type">Specialization / Type *</Label>
                <NativeSelect
                  id="team_type"
                  value={teamType}
                  onChange={(e) => setTeamType(e.target.value)}
                  className="w-full"
                >
                  <option value="Search and Rescue">Search and Rescue</option>
                  <option value="Water Rescue">Water Rescue</option>
                  <option value="Medical Support">Medical Support</option>
                  <option value="Logistics & Relief">Logistics & Relief</option>
                  <option value="Fire & Rescue">Fire & Rescue</option>
                  <option value="Helicopter Evacuation">
                    Helicopter Evacuation
                  </option>
                </NativeSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Operational Status *</Label>
                <NativeSelect
                  id="availability"
                  value={availability}
                  onChange={(e) =>
                    setAvailability(
                      e.target.value as "available" | "busy" | "offline"
                    )
                  }
                  className="w-full"
                >
                  <option value="available">
                    Available (Ready for assignment)
                  </option>
                  <option value="busy">Busy (Currently on field)</option>
                  <option value="offline">Offline (Off duty / standby)</option>
                </NativeSelect>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={rescueTeams.create.isPending}
              >
                <Plus className="size-4" />
                {rescueTeams.create.isPending
                  ? "Registering..."
                  : "Add Rescue Team"}
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
                <span>Rescue Teams List</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {rescueTeams.data.length} teams
                </Badge>
              </CardTitle>
              <CardDescription>
                Registered response units & deployment readiness
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-16">Team ID</TableHead>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rescueTeams.isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Loading rescue teams...
                      </TableCell>
                    </TableRow>
                  ) : rescueTeams.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No rescue teams found. Add your first team on the left!
                      </TableCell>
                    </TableRow>
                  ) : (
                    rescueTeams.data.map((row) => (
                      <TableRow key={row.team_id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-xs font-medium">
                          #{row.team_id}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {row.team_name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {row.team_type}
                        </TableCell>
                        <TableCell>
                          {getAvailabilityBadge(row.availability)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          <span className="font-medium">
                            {row.total_assignments ?? 0}
                          </span>{" "}
                          missions
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              rescueTeams.remove.mutate(row.team_id)
                            }
                            disabled={rescueTeams.remove.isPending}
                            title="Delete Team"
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
