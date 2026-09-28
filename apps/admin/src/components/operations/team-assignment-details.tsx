"use client"

import Link from "next/link"
import { ArrowLeft, ClipboardList, Trash2 } from "lucide-react"

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
import { useTeamAssignment } from "@/hooks/operations/use-team-assignments"

import { AssignmentStatusBadge } from "./badges"

export function TeamAssignmentDetails({
  assignmentId,
}: {
  assignmentId: number
}) {
  const { assignment, isLoading, remove } = useTeamAssignment(assignmentId)

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading assignment...
      </div>
    )
  }

  if (!assignment) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Assignment #{assignmentId} not found.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.teamManagement.list} />}
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
          render={<Link href={adminRoutes.operations.teamManagement.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Team Management
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => remove.mutate(assignmentId)}
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
                <ClipboardList className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Assignment #{assignment.assignment_id}
                </CardTitle>
                <CardDescription>
                  {assignment.team_name || `Team #${assignment.team_id}`} → Req
                  #{assignment.request_id}
                </CardDescription>
              </div>
            </div>
            <AssignmentStatusBadge status={assignment.status} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Team
            </p>
            <p className="text-base font-medium">
              {assignment.team_name || `Team #${assignment.team_id}`}
            </p>
            <p className="text-xs text-muted-foreground">
              Type: {assignment.team_type || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Citizen
            </p>
            <p className="text-base font-medium">
              {assignment.citizen_name || "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {assignment.citizen_phone || ""}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Priority
            </p>
            <Badge
              variant="outline"
              className={
                assignment.request_priority === "critical"
                  ? "bg-destructive/10 text-destructive"
                  : ""
              }
            >
              {assignment.request_priority || "—"}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Assigned At
            </p>
            <p className="font-mono text-sm">
              {assignment.assignment_at
                ? new Date(assignment.assignment_at).toLocaleString()
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
