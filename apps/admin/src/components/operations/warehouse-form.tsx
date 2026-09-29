"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"

import { adminRoutes } from "@/config/routes"
import { useWarehouses } from "@/hooks/operations/use-warehouses"

export function WarehouseForm() {
  const router = useRouter()
  const { create } = useWarehouses()

  const [warehouseName, setWarehouseName] = useState("")
  const [locationId, setLocationId] = useState("")
  const [managerId, setManagerId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!warehouseName) return
    create.mutate(
      {
        warehouse_name: warehouseName,
        location_id: locationId ? Number(locationId) : null,
        manager_id: managerId ? Number(managerId) : null,
      },
      {
        onSuccess: () => {
          setWarehouseName("")
          setLocationId("")
          setManagerId("")
          router.push(adminRoutes.operations.warehouses.list)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="warehouse_name">Warehouse Name *</Label>
        <Input
          id="warehouse_name"
          value={warehouseName}
          onChange={(e) => setWarehouseName(e.target.value)}
          placeholder="Dhaka Central Relief Warehouse"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="location_id">Location ID</Label>
          <Input
            id="location_id"
            type="number"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="manager_id">Manager User ID</Label>
          <Input
            id="manager_id"
            type="number"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={create.isPending}>
        {create.isPending ? "Creating…" : "Create Warehouse"}
      </Button>
    </form>
  )
}
