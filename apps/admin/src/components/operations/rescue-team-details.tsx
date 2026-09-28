"use client"

import Link from "next/link"
import { ArrowLeft, ShieldCheck, Trash2 } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

import { adminRoutes } from "@/config/routes"
import { useRescueTeam } from "@/hooks/operations/use-rescue-teams"

import { AvailabilityBadge } from "./badges"

export function RescueTeamDetails({ teamId }: { teamId: number }) {
  const { team, isLoading, remove } = useRescueTeam(teamId)

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading rescue team...
      </div>
    )
  }

  if (!team) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Rescue team #{teamId} not found.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.rescueTeams.list} />}
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
          render={<Link href={adminRoutes.operations.rescueTeams.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Rescue Teams
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => remove.mutate(teamId)}
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
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{team.team_name}</CardTitle>
                <CardDescription>Team #{team.team_id}</CardDescription>
              </div>
            </div>
            <AvailabilityBadge availability={team.availability} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Specialization
            </p>
            <p className="text-base font-medium">{team.team_type}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Total Assignments
            </p>
            <p className="font-mono text-2xl font-bold">
              {team.total_assignments ?? 0}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Created At
            </p>
            <p className="font-mono text-sm">
              {team.created_at
                ? new Date(team.created_at).toLocaleString()
                : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Last Updated
            </p>
            <p className="font-mono text-sm">
              {team.updated_at
                ? new Date(team.updated_at).toLocaleString()
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
