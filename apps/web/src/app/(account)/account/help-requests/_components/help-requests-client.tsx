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
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { Textarea } from "@shurokkha/ui/components/textarea"

import {
  useHelpRequestMutations,
  useMyHelpRequests,
} from "@/features/help-requests/hooks/use-help-requests"

import {
  HELP_REQUEST_PRIORITIES,
  HELP_REQUEST_TYPES,
  type HelpRequestPriority,
  type HelpRequestType,
} from "@shurokkha/contracts"

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  assigned: "border-blue-500/30 bg-blue-500/15 text-blue-700",
  in_progress: "border-blue-500/30 bg-blue-500/15 text-blue-700",
  resolved: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  cancelled: "border-muted-foreground/30 bg-muted text-muted-foreground",
}

export function HelpRequestsClient() {
  const { data, isLoading } = useMyHelpRequests()
  const { submit } = useHelpRequestMutations()

  const [requestType, setRequestType] = useState<HelpRequestType>("rescue")
  const [priority, setPriority] = useState<HelpRequestPriority>("normal")
  const [description, setDescription] = useState("")
  const [affected, setAffected] = useState("1")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !address || !phone) return
    submit.mutate(
      {
        request_type: requestType,
        priority,
        description,
        affected_people_count: Number(affected) || 1,
        address,
        contact_phone: phone,
      },
      {
        onSuccess: () => {
          setDescription("")
          setAddress("")
          setPhone("")
          setAffected("1")
        },
      }
    )
  }

  const requests = data ?? []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submit a help request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="request_type">Type</Label>
                <NativeSelect
                  id="request_type"
                  value={requestType}
                  onChange={(e) =>
                    setRequestType(e.target.value as HelpRequestType)
                  }
                >
                  {HELP_REQUEST_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <NativeSelect
                  id="priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as HelpRequestPriority)
                  }
                >
                  {HELP_REQUEST_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="affected">Affected people</Label>
                <Input
                  id="affected"
                  type="number"
                  min="1"
                  value={affected}
                  onChange={(e) => setAffected(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Contact phone *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801700000000"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, area, district"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
            <Button type="submit" disabled={submit.isPending}>
              {submit.isPending ? "Submitting…" : "Submit request"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No help requests filed.
            </p>
          ) : (
            requests.map((r) => (
              <div
                key={r.help_request_id}
                className="rounded-md border p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">
                    {r.request_type} · {r.priority}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      STATUS_STYLES[r.status] ??
                      "border-muted-foreground/30 bg-muted text-muted-foreground"
                    }
                  >
                    {r.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  #{r.help_request_id}
                  {r.created_at
                    ? ` · ${new Date(r.created_at).toLocaleString()}`
                    : ""}
                </div>
                <p className="mt-1 text-sm text-foreground/80">
                  {r.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.address} · {r.contact_phone}
                </p>
                {r.assigned_team_name ? (
                  <p className="mt-1 text-xs">
                    <span className="font-semibold">Assigned:</span>{" "}
                    {r.assigned_team_name}
                  </p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
