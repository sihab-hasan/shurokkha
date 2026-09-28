import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Database,
  Flame,
  History,
  Zap,
} from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

export function DashboardCoreNavSection() {
  const operations = [
    {
      title: "Citizen Emergency History",
      type: "Database View",
      description: "View unified multi-table records joining Users, Roles, Requests, and Disasters.",
      href: "/get-help",
      icon: History,
      variant: "primary" as const,
      btnLabel: "Open View History",
    },
    {
      title: "Atomic Disaster & Emergency",
      type: "Transaction (Commit/Rollback)",
      description: "Concurrently report a disaster, link affected areas, and register emergency assistance.",
      href: "/get-help",
      icon: Database,
      variant: "primary" as const,
      btnLabel: "File Atomic Report",
    },
    {
      title: "Critical Alerts Feed",
      type: "Union Query",
      description: "Live feed combining severe national disasters and critical citizen emergency calls.",
      href: "/emergency-alerts",
      icon: Flame,
      variant: "danger" as const,
      btnLabel: "View Alerts Feed",
    },
    {
      title: "Escalate Disaster Severity",
      type: "Stored Procedure",
      description: "Trigger sp_escalate_disaster_and_requests to elevate severity and escalate all requests.",
      href: "/disasters",
      icon: Zap,
      variant: "warning" as const,
      btnLabel: "Open Disaster Console",
    },
  ]

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Database className="size-4" />
              </span>
              <CardTitle className="text-lg font-bold tracking-tight">
                Disaster & Emergency Operations
              </CardTitle>
            </div>
            <CardDescription>
              Direct access to system database operations (Views, Transactions, Stored Procedures, and Union feeds).
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {operations.map((op) => {
            const Icon = op.icon
            return (
              <div
                key={op.title}
                className="flex flex-col justify-between rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
                      <Icon className="size-4 text-primary" />
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {op.type}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm leading-tight text-foreground">
                      {op.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {op.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-between text-xs"
                    render={<Link href={op.href} />}
                  >
                    <span>{op.btnLabel}</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
