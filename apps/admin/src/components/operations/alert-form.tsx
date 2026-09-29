"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { Textarea } from "@shurokkha/ui/components/textarea"

import { ALERT_SEVERITIES, ALERT_STATUSES } from "@shurokkha/contracts"

import { adminRoutes } from "@/config/routes"
import { useAlerts } from "@/hooks/operations/use-alerts"
import { useDisasters } from "@/hooks/operations/use-disasters"
import type { AlertSeverity, AlertStatus } from "@/hooks/operations/types"

export function AlertForm() {
  const router = useRouter()
  const { create } = useAlerts()
  const disasters = useDisasters()

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState<AlertSeverity>("info")
  const [status, setStatus] = useState<AlertStatus>("active")
  const [disasterId, setDisasterId] = useState<string>("")
  const [areaDescription, setAreaDescription] = useState("")
  const [expiresAt, setExpiresAt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !message) return

    create.mutate(
      {
        title,
        message,
        severity,
        status,
        disaster_id: disasterId ? Number(disasterId) : null,
        area_description: areaDescription || null,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      },
      {
        onSuccess: () => {
          setTitle("")
          setMessage("")
          router.push(adminRoutes.operations.alerts.list)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Evacuation order for Sylhet district"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="All residents in low-lying areas must evacuate to higher ground by 6pm."
          rows={5}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="severity">Severity *</Label>
          <NativeSelect
            id="severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
          >
            {ALERT_SEVERITIES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <NativeSelect
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as AlertStatus)}
          >
            {ALERT_STATUSES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="disaster_id">Linked Disaster (optional)</Label>
        <NativeSelect
          id="disaster_id"
          value={disasterId}
          onChange={(e) => setDisasterId(e.target.value)}
        >
          <option value="">— None —</option>
          {disasters.map((d) => (
            <option key={d.disaster_id} value={d.disaster_id}>
              #{d.disaster_id} - {d.disaster_name} ({d.severity})
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="area_description">Area Description</Label>
        <Input
          id="area_description"
          value={areaDescription}
          onChange={(e) => setAreaDescription(e.target.value)}
          placeholder="Sunamganj, Habiganj, Netrokona districts"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="expires_at">Expires At</Label>
        <Input
          id="expires_at"
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={create.isPending}>
        {create.isPending ? "Publishing…" : "Publish Alert"}
      </Button>
    </form>
  )
}
