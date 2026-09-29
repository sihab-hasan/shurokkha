"use client"

import Link from "next/link"
import { ArrowLeft, Truck } from "lucide-react"

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
import { useWarehouses } from "@/hooks/operations/use-warehouses"

import { WarehouseDistributeForm } from "./warehouse-distribute-form"

export function WarehouseDetails({ warehouseId }: { warehouseId: number }) {
  const { data, isLoading, remove } = useWarehouses()

  const warehouse = isLoading
    ? undefined
    : data.find((w) => w.warehouse_id === warehouseId)

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading warehouse...
      </div>
    )
  }

  if (!warehouse) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Warehouse #{warehouseId} not found.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.warehouses.list} />}
          >
            <ArrowLeft className="size-4" /> Back to list
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={adminRoutes.operations.warehouses.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Warehouses
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => remove.mutate(warehouseId)}
          disabled={remove.isPending}
        >
          Delete
        </Button>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Truck className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {warehouse.warehouse_name}
                </CardTitle>
                <CardDescription>
                  Warehouse #{warehouse.warehouse_id}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Manager
            </p>
            <p className="text-sm">{warehouse.manager_name || "—"}</p>
            <p className="text-xs text-muted-foreground">
              {warehouse.manager_email || ""}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Location
            </p>
            <p className="font-mono text-sm">
              {warehouse.location_id ? `#${warehouse.location_id}` : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Distribute Relief</CardTitle>
          <CardDescription>
            Atomically deduct inventory and create a relief distribution record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WarehouseDistributeForm warehouseId={warehouseId} />
        </CardContent>
      </Card>
    </div>
  )
}
