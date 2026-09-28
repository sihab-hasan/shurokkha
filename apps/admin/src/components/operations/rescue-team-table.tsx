"use client"

import Link from "next/link"
import { Trash2 } from "lucide-react"

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

import { adminRoutes } from "@/config/routes"
import { useRescueTeams } from "@/hooks/operations/use-rescue-teams"

import { Can } from "@/components/auth/can"
import { availabilityBadgeClass } from "./badges"

export function RescueTeamTable() {
  const { data, isLoading, remove } = useRescueTeams()

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Rescue Teams</span>
            <Badge variant="outline" className="font-mono text-xs">
              {data.length} teams
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
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading rescue teams...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No rescue teams found. Register your first team.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.team_id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-medium">
                      <Link
                        href={adminRoutes.operations.rescueTeams.detail(
                          row.team_id
                        )}
                        className="hover:underline"
                      >
                        #{row.team_id}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {row.team_name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.team_type}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={availabilityBadgeClass(row.availability)}
                      >
                        {row.availability}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <span className="font-medium">
                        {row.total_assignments ?? 0}
                      </span>{" "}
                      missions
                    </TableCell>
                    <TableCell className="text-right">
                      <Can role="admin">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => remove.mutate(row.team_id)}
                          disabled={remove.isPending}
                          title="Delete Team"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </Can>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
