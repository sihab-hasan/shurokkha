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

import { useFacilityLocations } from "@/hooks/operations/use-reports"

export function FacilityLocationsTable() {
  const query = useFacilityLocations()
  const data = query.data ?? []
  const isLoading = query.isLoading

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Facility Locations</CardTitle>
        <CardDescription>
          Geographic coordinates for every mapped facility.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Latitude</TableHead>
              <TableHead className="text-right">Longitude</TableHead>
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
                  No facility locations recorded.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">
                    {row.facility_id != null ? `#${row.facility_id}` : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {row.facility_type ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {row.facility_name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {row.latitude != null ? row.latitude.toFixed(5) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {row.longitude != null ? row.longitude.toFixed(5) : "—"}
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
