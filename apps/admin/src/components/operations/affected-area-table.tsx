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
import { useAffectedAreas } from "@/hooks/operations/use-affected-areas"

import { Can } from "@/components/auth/can"
import { severityBadgeClass } from "./badges"

export function AffectedAreaTable() {
  const { data, isLoading, remove } = useAffectedAreas()

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Affected Areas</span>
            <Badge variant="outline" className="font-mono text-xs">
              {data.length} records
            </Badge>
          </CardTitle>
          <CardDescription>
            Live data directly synced from MySQL database
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Area ID</TableHead>
                <TableHead>Disaster</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Severity</TableHead>
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
                    Loading affected areas...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No affected areas found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.area_id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-medium">
                      <Link
                        href={adminRoutes.operations.affectedAreas.detail(
                          row.area_id
                        )}
                        className="hover:underline"
                      >
                        #{row.area_id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {row.disaster_name || `Disaster #${row.disaster_id}`}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ID: {row.disaster_id}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.location_id ? `Loc #${row.location_id}` : "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {Number(row.affected_population).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={severityBadgeClass(row.severity)}
                      >
                        {row.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Can role="admin">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => remove.mutate(row.area_id)}
                          disabled={remove.isPending}
                          title="Delete Row"
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
