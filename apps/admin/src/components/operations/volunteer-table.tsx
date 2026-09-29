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
import { useVolunteers } from "@/hooks/operations/use-volunteers"

import { Can } from "@/components/auth/can"
import { statusBadgeClass } from "./badges"

export function VolunteerTable() {
  const { data, isLoading, remove } = useVolunteers()

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Volunteer Applications</span>
            <Badge variant="outline" className="font-mono text-xs">
              {data.length} records
            </Badge>
          </CardTitle>
          <CardDescription>
            Citizens who have applied to volunteer. Review to approve or reject.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading applications...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No volunteer applications yet.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow
                    key={row.volunteer_id}
                    className="hover:bg-muted/30"
                  >
                    <TableCell className="font-mono text-xs font-medium">
                      <Link
                        href={adminRoutes.operations.volunteers.detail(
                          row.volunteer_id
                        )}
                        className="hover:underline"
                      >
                        #{row.volunteer_id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{row.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.user_full_name || row.email || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.phone}
                    </TableCell>
                    <TableCell className="line-clamp-1 max-w-xs text-xs text-muted-foreground">
                      {row.skills || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusBadgeClass(row.status)}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Can role="admin">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => remove.mutate(row.volunteer_id)}
                          disabled={remove.isPending}
                          title="Delete Application"
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
