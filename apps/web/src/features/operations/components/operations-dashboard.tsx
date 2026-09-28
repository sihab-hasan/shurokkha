"use client"

import { useState } from "react"
import {
  MapPin,
  ShieldCheck,
  ClipboardList,
  Database,
  CheckCircle2,
} from "lucide-react"
import { Badge } from "@shurokkha/ui/components/badge"
import { useOperationsData } from "../hooks/use-operations"
import { AffectedAreasTab } from "./affected-areas-tab"
import { RescueTeamsTab } from "./rescue-teams-tab"
import { TeamManagementTab } from "./team-management-tab"

export function OperationsDashboard() {
  const [activeTab, setActiveTab] = useState<string>("affected-areas")
  const { affectedAreas, rescueTeams, assignments } = useOperationsData()

  const availableTeams = rescueTeams.data.filter(
    (t) => t.availability === "available"
  ).length
  const activeAssignments = assignments.data.filter(
    (a) => a.status === "assigned" || a.status === "on_route"
  ).length
  const totalPopulation = affectedAreas.data.reduce(
    (sum, a) => sum + Number(a.affected_population || 0),
    0
  )

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="default"
                className="bg-primary font-semibold text-primary-foreground"
              >
                Direct Lab Admin
              </Badge>
              <Badge
                variant="outline"
                className="border-primary/30 text-primary"
              >
                <Database className="mr-1 inline size-3" /> MySQL: shurokkha_db
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Response Operations Management
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Dedicated management interface for <strong>Affected Areas</strong>
              , <strong>Rescue Teams</strong>, and{" "}
              <strong>Team Management</strong>. No login required.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border bg-background/80 p-3 px-4 text-center shadow-sm backdrop-blur">
              <span className="block text-xs text-muted-foreground">
                DB Status
              </span>
              <span className="flex items-center justify-center gap-1 text-sm font-semibold text-emerald-600">
                ● Live Connected
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-primary/15 pt-6 sm:grid-cols-4">
          <div className="rounded-xl border bg-background/70 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <MapPin className="size-3.5 text-primary" /> Affected Areas
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">
              {affectedAreas.data.length}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {totalPopulation.toLocaleString()} affected pop.
            </span>
          </div>

          <div className="rounded-xl border bg-background/70 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" /> Rescue Teams
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">
              {rescueTeams.data.length}
            </div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {availableTeams} ready / available
            </span>
          </div>

          <div className="rounded-xl border bg-background/70 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ClipboardList className="size-3.5 text-blue-500" /> Active
              Missions
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">
              {activeAssignments}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {assignments.data.length} total assignments
            </span>
          </div>

          <div className="rounded-xl border bg-background/70 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-indigo-500" /> Completed
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">
              {assignments.data.filter((a) => a.status === "completed").length}
            </div>
            <span className="text-[11px] text-muted-foreground">
              Missions accomplished
            </span>
          </div>
        </div>
      </div>

      {/* Tab Selector Bar */}
      <div className="flex flex-wrap gap-2 rounded-2xl border bg-muted/80 p-1.5 sm:flex-nowrap">
        <button
          type="button"
          onClick={() => setActiveTab("affected-areas")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === "affected-areas"
              ? "bg-background font-semibold text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
          }`}
        >
          <MapPin className="size-4 text-primary" />
          <span>1. Affected Areas</span>
          <Badge
            variant={activeTab === "affected-areas" ? "default" : "secondary"}
            className="px-2 py-0.5 text-xs"
          >
            {affectedAreas.data.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rescue-teams")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === "rescue-teams"
              ? "bg-background font-semibold text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
          }`}
        >
          <ShieldCheck className="size-4 text-emerald-500" />
          <span>2. Rescue Teams</span>
          <Badge
            variant={activeTab === "rescue-teams" ? "default" : "secondary"}
            className="px-2 py-0.5 text-xs"
          >
            {rescueTeams.data.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("team-management")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === "team-management"
              ? "bg-background font-semibold text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
          }`}
        >
          <ClipboardList className="size-4 text-blue-500" />
          <span>3. Team Management</span>
          <Badge
            variant={activeTab === "team-management" ? "default" : "secondary"}
            className="px-2 py-0.5 text-xs"
          >
            {assignments.data.length}
          </Badge>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {activeTab === "affected-areas" && <AffectedAreasTab />}
        {activeTab === "rescue-teams" && <RescueTeamsTab />}
        {activeTab === "team-management" && <TeamManagementTab />}
      </div>
    </div>
  )
}
