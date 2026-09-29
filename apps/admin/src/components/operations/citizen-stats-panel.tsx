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

import { useCitizenStats } from "@/hooks/operations/use-reports"

export function CitizenStatsPanel() {
  const query = useCitizenStats()
  const data = query.data ?? []
  const isLoading = query.isLoading

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Citizen Request Statistics</CardTitle>
        <CardDescription>
          Per-citizen breakdown of submitted, resolved, pending, and cancelled
          emergency requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Resolved</TableHead>
              <TableHead className="text-right">Pending</TableHead>
              <TableHead className="text-right">Cancelled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No citizen requests yet.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.user_id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="text-sm font-medium">
                      {row.full_name || `User #${row.user_id}`}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      #{row.user_id}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {row.total_requests?.toLocaleString() ?? 0}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {row.resolved?.toLocaleString() ?? 0}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {row.pending?.toLocaleString() ?? 0}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {row.cancelled?.toLocaleString() ?? 0}
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
