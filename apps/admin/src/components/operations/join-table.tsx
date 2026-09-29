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

import { severityBadgeClass } from "./badges"

interface JoinTableProps {
  title: string
  description: string
  data: Array<Record<string, unknown>>
  isLoading: boolean
  emptyMessage: string
}

/**
 * Generic join-result table. The `/v1/admin/reports/*-join` endpoints
 * all return rows with the same loose shape (user_id, name, email,
 * disaster_id, disaster_name, area_id, severity) so a single
 * component handles all five join flavors.
 */
export function JoinTable({
  title,
  description,
  data,
  isLoading,
  emptyMessage,
}: JoinTableProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Disaster</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">
                    {row.user_id != null ? `#${row.user_id}` : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {(row.name as string | undefined) ?? "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {(row.email as string | undefined) ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {(row.disaster_name as string | undefined) ??
                      (row.disaster_id != null
                        ? `Disaster #${row.disaster_id}`
                        : "—")}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.area_id != null ? `#${row.area_id}` : "—"}
                  </TableCell>
                  <TableCell>
                    {row.severity != null ? (
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${severityBadgeClass(
                          row.severity as string
                        )}`}
                      >
                        {row.severity as string}
                      </span>
                    ) : (
                      "—"
                    )}
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
