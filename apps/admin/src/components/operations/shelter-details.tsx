"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Building2, Trash2 } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"

import { adminRoutes } from "@/config/routes"
import { useShelter } from "@/hooks/operations/use-shelters"

import { statusBadgeClass } from "./badges"
import { ShelterForm } from "./shelter-form"

export function ShelterDetails({ shelterId }: { shelterId: number }) {
  const { shelter, isLoading, remove, updateOccupancy } = useShelter(shelterId)

  const [occupancyInput, setOccupancyInput] = useState<string>("")

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading shelter...
      </div>
    )
  }

  if (!shelter) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Shelter #{shelterId} not found.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.shelters.list} />}
          >
            <ArrowLeft className="size-4" /> Back to list
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleQuickOccupancy = (e: React.FormEvent) => {
    e.preventDefault()
    if (occupancyInput === "") return
    updateOccupancy.mutate({
      id: shelterId,
      input: { occupancy: Number(occupancyInput) },
    })
    setOccupancyInput("")
  }

  const free =
    shelter.available_capacity ??
    Math.max(0, shelter.capacity - shelter.occupancy)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={adminRoutes.operations.shelters.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Shelters
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => remove.mutate(shelterId)}
          disabled={remove.isPending}
        >
          <Trash2 className="size-4" /> Delete
        </Button>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Building2 className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {shelter.shelter_name}
                </CardTitle>
                <CardDescription>Shelter #{shelter.shelter_id}</CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={statusBadgeClass(shelter.status)}
            >
              {shelter.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Capacity
              </p>
              <p className="font-mono text-2xl">{shelter.capacity}</p>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Occupancy
              </p>
              <p className="font-mono text-2xl">{shelter.occupancy}</p>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Available
              </p>
              <p className="font-mono text-2xl">{free}</p>
              {shelter.occupancy_percentage != null ? (
                <p className="text-xs text-muted-foreground">
                  {shelter.occupancy_percentage}% full
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Affected Area
              </p>
              <p className="text-sm">
                {shelter.area_id ? `Area #${shelter.area_id}` : "—"}
              </p>
              {shelter.area_severity ? (
                <p className="text-xs text-muted-foreground">
                  Severity {shelter.area_severity}
                </p>
              ) : null}
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Affected Population
              </p>
              <p className="font-mono text-sm">
                {shelter.affected_population ?? "—"}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleQuickOccupancy}
            className="flex items-end gap-3"
          >
            <div className="grow space-y-1.5">
              <Label htmlFor="quick-occupancy">Quick Occupancy Update</Label>
              <Input
                id="quick-occupancy"
                type="number"
                min="0"
                step="1"
                value={occupancyInput}
                onChange={(e) => setOccupancyInput(e.target.value)}
                placeholder="New occupancy"
              />
            </div>
            <Button type="submit" disabled={updateOccupancy.isPending}>
              {updateOccupancy.isPending ? "Updating…" : "Update via Procedure"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Calls the <code>sp_update_shelter_occupancy</code> stored procedure
            on the backend for atomic bound checks.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Edit Shelter</CardTitle>
          <CardDescription>
            Update name, capacity, status, or area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShelterForm
            initial={{
              shelter_id: shelter.shelter_id,
              shelter_name: shelter.shelter_name,
              capacity: shelter.capacity,
              occupancy: shelter.occupancy,
              status: shelter.status,
              area_id: shelter.area_id,
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
