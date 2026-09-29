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
import { useShelters } from "@/hooks/operations/use-shelters"

import { Can } from "@/components/auth/can"
import { statusBadgeClass } from "./badges"

export function ShelterTable() {
  const { data, isLoading, remove } = useShelters()

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Shelters</span>
            <Badge variant="outline" className="font-mono text-xs">
              {data.length} records
            </Badge>
          </CardTitle>
          <CardDescription>
            Evacuation shelters and their current occupancy.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Shelter</TableHead>
                <TableHead className="text-right">Capacity</TableHead>
                <TableHead className="text-right">Occupancy</TableHead>
                <TableHead className="text-right">Free</TableHead>
                <TableHead>Status</TableHead>
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
                    Loading shelters...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No shelters yet. Create one to register capacity.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => {
                  const free =
                    row.available_capacity ??
                    Math.max(0, row.capacity - row.occupancy)
                  return (
                    <TableRow
                      key={row.shelter_id}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="font-mono text-xs font-medium">
                        <Link
                          href={adminRoutes.operations.shelters.detail(
                            row.shelter_id
                          )}
                          className="hover:underline"
                        >
                          #{row.shelter_id}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm font-medium">
                          {row.shelter_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {row.area_id ? `Area #${row.area_id}` : "No area"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {row.capacity}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {row.occupancy}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {free}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusBadgeClass(row.status)}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Can role="admin">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => remove.mutate(row.shelter_id)}
                            disabled={remove.isPending}
                            title="Delete Shelter"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </Can>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
