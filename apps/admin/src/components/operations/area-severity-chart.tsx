"use client"

import { Badge } from "@shurokkha/ui/components/badge"
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

import { useAreaSeverity } from "@/hooks/operations/use-reports"

import { severityBadgeClass } from "./badges"

export function AreaSeverityChart() {
  const query = useAreaSeverity()
  const data = query.data ?? []
  const isLoading = query.isLoading

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Affected Areas by Severity</CardTitle>
        <CardDescription>
          Population breakdown per area grouped by disaster severity.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Area</TableHead>
              <TableHead>Disaster</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">Affected Pop.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  No area-severity data yet.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow
                  key={`${row.area_id}-${idx}`}
                  className="hover:bg-muted/30"
                >
                  <TableCell>
                    <div className="text-sm font-medium">
                      {row.area_name || `Area #${row.area_id}`}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      #{row.area_id}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {row.disaster_name || `Disaster #${row.disaster_id}`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={severityBadgeClass(row.severity ?? "")}
                    >
                      {row.severity ?? "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {(row.affected_population ?? 0).toLocaleString()}
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
