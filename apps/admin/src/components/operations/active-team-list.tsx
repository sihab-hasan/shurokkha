"use client"

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

import { useActiveTeams } from "@/hooks/operations/use-reports"

import { assignmentStatusBadgeClass } from "./badges"

export function ActiveTeamList() {
  const query = useActiveTeams()
  const data = query.data ?? []
  const isLoading = query.isLoading

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">
          Active Rescue Team Assignments
        </CardTitle>
        <CardDescription>
          Live assignments where the rescue team is on a mission.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Assignment</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Assigned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No active assignments.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.assignment_id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">
                    #{row.assignment_id}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{row.team_name}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      Team #{row.team_id}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    Request #{row.request_id}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${assignmentStatusBadgeClass(row.status ?? "")}`}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {row.assigned_at
                      ? new Date(row.assigned_at).toLocaleString()
                      : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
