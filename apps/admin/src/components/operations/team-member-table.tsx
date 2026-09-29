"use client"

import Link from "next/link"
import { Info } from "lucide-react"

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

export function TeamMemberTable() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Team Members</span>
            <Badge variant="outline" className="font-mono text-xs">
              0 members
            </Badge>
          </CardTitle>
          <CardDescription>
            Members assigned to each rescue team
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={adminRoutes.operations.teamManagement.list} />}
        >
          Back to assignments
        </Button>
      </CardHeader>
      <CardContent className="py-12 text-center">
        <Info className="mx-auto mb-3 size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Team-member data will appear here once the backend exposes member
          endpoints.
        </p>
      </CardContent>
    </Card>
  )
}
