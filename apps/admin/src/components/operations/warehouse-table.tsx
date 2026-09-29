"use client"

import Link from "next/link"
import { Trash2, Truck } from "lucide-react"

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
import { useWarehouses } from "@/hooks/operations/use-warehouses"

import { Can } from "@/components/auth/can"

export function WarehouseTable() {
  const { data, isLoading, remove } = useWarehouses()

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Truck className="size-5" />
            <span>Warehouses</span>
            <Badge variant="outline" className="font-mono text-xs">
              {data.length} records
            </Badge>
          </CardTitle>
          <CardDescription>
            Distribution centers for relief supplies.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading warehouses...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No warehouses yet. Create one to register inventory.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow
                    key={row.warehouse_id}
                    className="hover:bg-muted/30"
                  >
                    <TableCell className="font-mono text-xs font-medium">
                      <Link
                        href={adminRoutes.operations.warehouses.detail(
                          row.warehouse_id
                        )}
                        className="hover:underline"
                      >
                        #{row.warehouse_id}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {row.warehouse_name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.manager_name ? (
                        <div>
                          <div>{row.manager_name}</div>
                          <div className="font-mono">{row.manager_email}</div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.location_id ? `#${row.location_id}` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Can role="admin">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => remove.mutate(row.warehouse_id)}
                          disabled={remove.isPending}
                          title="Delete Warehouse"
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
