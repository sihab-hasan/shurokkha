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
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shurokkha/ui/components/table"

import { adminRoutes } from "@/config/routes"
import { useCan } from "@/hooks/auth/use-can"
import { useTeamAssignments } from "@/hooks/operations/use-team-assignments"
import type { AssignmentStatus } from "@/hooks/operations/types"

import { Can } from "@/components/auth/can"
import { assignmentStatusBadgeClass } from "./badges"

const ASSIGNMENT_STATUS_OPTIONS: { value: AssignmentStatus; label: string }[] =
  [
    { value: "assigned", label: "Assigned" },
    { value: "on_route", label: "On Route" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

export function TeamAssignmentTable() {
  const { data, isLoading, updateStatus, remove } = useTeamAssignments()
  const { allowed: canMutate } = useCan({ role: "admin" })

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Team Assignments</span>
            <Badge variant="outline" className="font-mono text-xs">
              {data.length} assignments
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
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading team assignments...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No team assignments found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow
                    key={row.assignment_id}
                    className="hover:bg-muted/30"
                  >
                    <TableCell className="font-mono text-xs font-medium">
                      <Link
                        href={adminRoutes.operations.teamManagement.detail(
                          row.assignment_id
                        )}
                        className="hover:underline"
                      >
                        #{row.assignment_id}
                      </Link>
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
                          {row.citizen_phone ? `(${row.citizen_phone})` : ""}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={assignmentStatusBadgeClass(row.status)}
                        >
                          {row.status}
                        </Badge>
                        <NativeSelect
                          value={row.status}
                          onChange={(e) =>
                            updateStatus.mutate({
                              id: row.assignment_id,
                              status: e.target.value as AssignmentStatus,
                            })
                          }
                          className="h-8 py-0 text-xs"
                          disabled={!canMutate}
                        >
                          {ASSIGNMENT_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </NativeSelect>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Can role="admin">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => remove.mutate(row.assignment_id)}
                          disabled={remove.isPending}
                          title="Delete Assignment"
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
