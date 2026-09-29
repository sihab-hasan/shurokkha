"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

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
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { toast } from "@shurokkha/ui/components/sonner"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getShurokkhaApi } from "@/lib/api"

import type {
  HouseholdInput,
  HouseholdMemberInput,
  HouseholdWithMembers,
} from "@shurokkha/contracts"

export function HouseholdClient() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["account", "household"],
    queryFn: async () => {
      const res = await getShurokkhaApi().account.household.show()
      return res.data ?? null
    },
  })

  const [headFullName, setHeadFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  const create = useMutation({
    mutationFn: async (input: HouseholdInput) =>
      getShurokkhaApi().account.household.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["account", "household"] })
      toast.success("Household registered.")
      setHeadFullName("")
      setPhone("")
      setAddress("")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to register household."),
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!headFullName || !phone || !address) return
    create.mutate({ head_full_name: headFullName, phone, address })
  }

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Register your household</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="head_full_name">Head full name *</Label>
              <Input
                id="head_full_name"
                value={headFullName}
                onChange={(e) => setHeadFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Registering…" : "Register household"}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <HouseholdWithMembersView
      data={data}
      onInvalidate={() =>
        qc.invalidateQueries({ queryKey: ["account", "household"] })
      }
    />
  )
}

function HouseholdWithMembersView({
  data,
  onInvalidate,
}: {
  data: HouseholdWithMembers
  onInvalidate: () => void
}) {
  const [memberName, setMemberName] = useState("")
  const [relationship, setRelationship] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState<"female" | "male" | "other" | "">("")

  const addMember = useMutation({
    mutationFn: async (input: HouseholdMemberInput) =>
      getShurokkhaApi().account.household.addMember(input),
    onSuccess: () => {
      onInvalidate()
      toast.success("Member added.")
      setMemberName("")
      setRelationship("")
      setAge("")
      setGender("")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to add member."),
  })

  const removeMember = useMutation({
    mutationFn: async (id: number) =>
      getShurokkhaApi().account.household.removeMember(id),
    onSuccess: () => {
      onInvalidate()
      toast.success("Member removed.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to remove member."),
  })

  const { household, members } = data

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Household</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Head
            </p>
            <p className="font-medium">{household.head_full_name}</p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Phone
            </p>
            <p className="font-mono">{household.phone}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Address
            </p>
            <p>{household.address}</p>
          </div>
          {household.notes ? (
            <div className="sm:col-span-2">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Notes
              </p>
              <p>{household.notes}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No members registered.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {members.map((m) => (
                <div
                  key={m.member_id}
                  className="flex items-start justify-between rounded-md border p-3 text-sm"
                >
                  <div>
                    <div className="font-medium">{m.full_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.relationship ?? "Member"}
                      {m.age != null ? ` · ${m.age}y` : ""}
                      {m.gender ? ` · ${m.gender}` : ""}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => removeMember.mutate(m.member_id)}
                    disabled={removeMember.isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!memberName) return
              addMember.mutate({
                full_name: memberName,
                relationship: relationship || null,
                age: age ? Number(age) : null,
                gender: (gender || null) as "female" | "male" | "other" | null,
              })
            }}
            className="grid gap-3 rounded-md border p-3 sm:grid-cols-4"
          >
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="member_name">Full name *</Label>
              <Input
                id="member_name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="member_rel">Relationship</Label>
              <Input
                id="member_rel"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="member_age">Age</Label>
              <Input
                id="member_age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="member_gender">Gender</Label>
              <NativeSelect
                id="member_gender"
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value as "female" | "male" | "other" | "")
                }
              >
                <option value="">—</option>
                <option value="female">female</option>
                <option value="male">male</option>
                <option value="other">other</option>
              </NativeSelect>
            </div>
            <div className="flex items-end sm:col-span-4">
              <Button type="submit" disabled={addMember.isPending}>
                Add member
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
