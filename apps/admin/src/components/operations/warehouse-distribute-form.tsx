"use client"

import { useState } from "react"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"

import { useWarehouses } from "@/hooks/operations/use-warehouses"

export interface WarehouseDistributeFormProps {
  warehouseId: number
  onSuccess?: () => void
}

export function WarehouseDistributeForm({
  warehouseId,
  onSuccess,
}: WarehouseDistributeFormProps) {
  const { distribute } = useWarehouses()

  const [areaId, setAreaId] = useState("")
  const [resourceId, setResourceId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [shelterId, setShelterId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!areaId || !resourceId || !quantity) return
    distribute.mutate(
      {
        id: warehouseId,
        input: {
          area_id: Number(areaId),
          resource_id: Number(resourceId),
          quantity: Number(quantity),
          shelter_id: shelterId ? Number(shelterId) : null,
        },
      },
      {
        onSuccess: () => {
          setAreaId("")
          setResourceId("")
          setQuantity("")
          setShelterId("")
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="area_id">Affected Area *</Label>
          <Input
            id="area_id"
            type="number"
            min="1"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            placeholder="1"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="resource_id">Resource *</Label>
          <Input
            id="resource_id"
            type="number"
            min="1"
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            placeholder="1"
            required
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min="0.01"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="100"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="shelter_id">Shelter (optional)</Label>
          <Input
            id="shelter_id"
            type="number"
            min="1"
            value={shelterId}
            onChange={(e) => setShelterId(e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>
      <Button type="submit" disabled={distribute.isPending}>
        {distribute.isPending ? "Distributing…" : "Distribute Relief"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Runs as a single DB transaction with a row lock; inventory and
        distribution records update atomically.
      </p>
    </form>
  )
}
