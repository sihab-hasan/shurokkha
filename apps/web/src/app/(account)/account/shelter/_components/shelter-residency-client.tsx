"use client"

import { useState } from "react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import {
  useMyShelterResidency,
  useShelterResidencyMutations,
} from "@/features/shelter-residency/hooks/use-shelter-residency"

import { usePublicShelters } from "@/features/shelters/hooks/use-shelters"

export function ShelterResidencyClient() {
  const { data, isLoading } = useMyShelterResidency()
  const { checkIn, checkOut } = useShelterResidencyMutations()
  const { data: sheltersData } = usePublicShelters()

  const [shelterId, setShelterId] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")

  const residency = data
  const shelters = sheltersData?.data ?? []

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {residency ? "Current residency" : "No active residency"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {residency ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {residency.shelter_name ?? `Shelter #${residency.shelter_id}`}
                </span>
                <Badge variant="outline">
                  since{" "}
                  {residency.checked_in_at
                    ? new Date(residency.checked_in_at).toLocaleDateString()
                    : "—"}
                </Badge>
              </div>
              {residency.notes ? (
                <p className="text-xs text-muted-foreground">
                  Notes: {residency.notes}
                </p>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                onClick={() => checkOut.mutate()}
                disabled={checkOut.isPending}
              >
                Check out
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You aren&apos;t currently checked in to any shelter.
            </p>
          )}
        </CardContent>
      </Card>

      {!residency ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Check into a shelter</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!shelterId || !fullName) return
                checkIn.mutate({
                  shelter_id: Number(shelterId),
                  full_name: fullName,
                  phone: phone || null,
                  notes: notes || null,
                })
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="shelter_id">Shelter</Label>
                <select
                  id="shelter_id"
                  value={shelterId}
                  onChange={(e) => setShelterId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  required
                >
                  <option value="">— Select shelter —</option>
                  {shelters.map((s) => (
                    <option key={s.shelter_id} value={s.shelter_id}>
                      {s.shelter_name} ({s.status})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full name *</Label>
                <Input
                  id="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801700000000"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes (bed, accessibility, etc.)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={!shelterId || !fullName || checkIn.isPending}
              >
                {checkIn.isPending ? "Checking in…" : "Check in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
