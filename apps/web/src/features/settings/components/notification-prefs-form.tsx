"use client"

import * as React from "react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"
import { SettingsCard } from "@shurokkha/ui/components/settings-card"
import { SettingsRow } from "@shurokkha/ui/components/settings-row"
import { SettingsSection } from "@shurokkha/ui/components/settings-section"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { Switch } from "@shurokkha/ui/components/switch"

import {
  DIGEST_CADENCE,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_EVENT_KEYS,
  type DigestCadence,
  type NotificationChannel,
  type NotificationEventKey,
  type NotificationPreferencesInput,
} from "@shurokkha/contracts"

import {
  useNotificationPrefs,
  useUpdateNotificationPrefs,
} from "../hooks/use-notification-prefs"
import { ApiFailure } from "@/features/shared/api-feedback"
import { timeAgo } from "@/features/shared/time-ago"
import { SaveBar } from "./save-bar"

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  email: "Email",
  sms: "SMS",
  push: "Push",
}

const EVENT_LABELS: Record<
  NotificationEventKey,
  { title: string; hint: string }
> = {
  assistance_update: {
    title: "Assistance updates",
    hint: "Status changes to your relief requests and dispatched teams.",
  },
  donation_receipt: {
    title: "Donation receipts",
    hint: "Confirmation when a donation is processed or refunded.",
  },
  emergency_alert: {
    title: "Emergency alerts",
    hint: "Critical disaster broadcasts in your region.",
  },
  weekly_digest: {
    title: "Weekly digest",
    hint: "Summary of platform activity, impact, and community news.",
  },
}

const DIGEST_LABELS: Record<DigestCadence, string> = {
  never: "Never",
  daily: "Daily",
  weekly: "Weekly",
}

export function NotificationPrefsForm() {
  const { data, isPending, isError, error } = useNotificationPrefs()
  const update = useUpdateNotificationPrefs()

  const [channels, setChannels] = React.useState<
    Record<NotificationChannel, boolean>
  >({
    email: true,
    sms: true,
    push: false,
  })
  const [prefs, setPrefs] = React.useState<
    NotificationPreferencesInput["preferences"]
  >({})
  const [start, setStart] = React.useState<string>("")
  const [end, setEnd] = React.useState<string>("")
  const [cadence, setCadence] = React.useState<DigestCadence>("weekly")

  // Seed once.
  const seededRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (!data || seededRef.current === String(data.updated_at)) return
    seededRef.current = String(data.updated_at)
    setChannels({
      email: data.email_enabled,
      sms: data.sms_enabled,
      push: data.push_enabled,
    })
    setPrefs(data.preferences ?? {})
    setStart(data.quiet_hours_start ?? "")
    setEnd(data.quiet_hours_end ?? "")
    setCadence(data.digest_cadence)
  }, [data])

  // Compute dirty state — re-saves are no-ops when nothing has changed.
  const pristineSnapshotRef = React.useRef<string | null>(null)
  const currentSnapshot = JSON.stringify({
    channels,
    prefs,
    start,
    end,
    cadence,
  })
  const dirty =
    pristineSnapshotRef.current !== null &&
    pristineSnapshotRef.current !== currentSnapshot

  React.useEffect(() => {
    if (data && pristineSnapshotRef.current === null) {
      pristineSnapshotRef.current = currentSnapshot
    }
  }, [currentSnapshot, data])
  React.useEffect(() => {
    // When the form finishes saving successfully, capture the new baseline.
    if (!update.isPending && update.isSuccess) {
      pristineSnapshotRef.current = currentSnapshot
    }
  }, [update.isPending, update.isSuccess, currentSnapshot])

  if (isPending) {
    return (
      <div className="space-y-8">
        <SettingsSection
          eyebrow="Delivery"
          title="Channels"
          description="Choose how you receive notifications overall."
        />
        <SettingsCard flush>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="size-9 rounded-full" />
            </div>
          ))}
        </SettingsCard>
      </div>
    )
  }

  if (isError) {
    return (
      <ApiFailure
        error={error}
        fallback="Could not load notification preferences."
      />
    )
  }

  function toggleChannel(channel: NotificationChannel, next: boolean) {
    setChannels((current) => ({ ...current, [channel]: next }))
  }

  function toggleEventChannel(
    event: NotificationEventKey,
    channel: NotificationChannel,
    checked: boolean
  ) {
    setPrefs((current) => {
      const existing = new Set(current[event] ?? [])
      if (checked) existing.add(channel)
      else existing.delete(channel)
      const next = { ...current }
      if (existing.size === 0) {
        delete next[event]
      } else {
        next[event] = NOTIFICATION_CHANNELS.filter((c) => existing.has(c))
      }
      return next
    })
  }

  function onSubmit() {
    if (update.isPending) return
    update.mutate({
      email_enabled: channels.email,
      sms_enabled: channels.sms,
      push_enabled: channels.push,
      quiet_hours_start: start.trim() || null,
      quiet_hours_end: end.trim() || null,
      digest_cadence: cadence,
      preferences: prefs,
    })
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <ApiFailure
        error={update.error}
        fallback="Could not save notification preferences."
      />

      <section className="space-y-4">
        <SettingsSection
          eyebrow="Delivery"
          title="Channels"
          description="Choose how you receive notifications overall."
          metadata={<span>Updated {timeAgo(data?.updated_at)}</span>}
        />
        <SettingsCard flush>
          <SettingsRow
            id="notif-channel-email"
            label="Email"
            description="Receipts, weekly digests, and account updates."
            control={
              <Switch
                id="notif-channel-email"
                checked={channels.email}
                onCheckedChange={(value) => toggleChannel("email", value)}
              />
            }
          />
          <SettingsRow
            id="notif-channel-sms"
            label="SMS"
            description="Critical alerts when verified emergencies occur."
            control={
              <Switch
                id="notif-channel-sms"
                checked={channels.sms}
                onCheckedChange={(value) => toggleChannel("sms", value)}
              />
            }
          />
          <SettingsRow
            id="notif-channel-push"
            label="Push"
            description="Browser and mobile push (rolls out gradually)."
            control={
              <Switch
                id="notif-channel-push"
                checked={channels.push}
                onCheckedChange={(value) => toggleChannel("push", value)}
              />
            }
          />
        </SettingsCard>
      </section>

      <section className="space-y-4">
        <SettingsSection
          eyebrow="Events"
          title="Per-event delivery"
          description="Override the channels for specific event types. Empty rows use your channel defaults."
        />
        <SettingsCard flush>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="px-6 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase">
                    Event
                  </th>
                  {NOTIFICATION_CHANNELS.map((channel) => (
                    <th
                      key={channel}
                      className="px-3 py-2.5 text-center text-[11px] font-medium tracking-wide uppercase"
                    >
                      {CHANNEL_LABELS[channel]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NOTIFICATION_EVENT_KEYS.map((event, index) => (
                  <tr
                    key={event}
                    className={
                      index === NOTIFICATION_EVENT_KEYS.length - 1
                        ? ""
                        : "border-b border-border/60"
                    }
                  >
                    <td className="px-6 py-3.5">
                      <Label
                        htmlFor={`evt-${event}`}
                        className="cursor-pointer text-sm font-medium"
                      >
                        {EVENT_LABELS[event].title}
                      </Label>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {EVENT_LABELS[event].hint}
                      </p>
                    </td>
                    {NOTIFICATION_CHANNELS.map((channel) => {
                      const checked = (prefs[event] ?? []).includes(channel)
                      return (
                        <td key={channel} className="px-3 py-3.5 text-center">
                          <span className="inline-flex items-center justify-center">
                            <Switch
                              size="sm"
                              id={`evt-${event}-${channel}`}
                              checked={checked}
                              onCheckedChange={(value) =>
                                toggleEventChannel(event, channel, value)
                              }
                              aria-label={`${EVENT_LABELS[event].title} via ${CHANNEL_LABELS[channel]}`}
                            />
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SettingsCard>
      </section>

      <section className="space-y-4">
        <SettingsSection
          eyebrow="Schedule"
          title="Quiet hours & digest"
          description="Mute non-critical alerts during your downtime; choose how often we send a summary."
        />
        <SettingsCard flush>
          <SettingsRow
            label="Quiet hours"
            description="Window during which non-critical alerts are muted."
            control={
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={start}
                  onChange={(event) => setStart(event.target.value)}
                  className="w-32"
                  aria-label="Quiet hours start"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={end}
                  onChange={(event) => setEnd(event.target.value)}
                  className="w-32"
                  aria-label="Quiet hours end"
                />
              </div>
            }
          />
          <SettingsRow
            label="Digest cadence"
            description="How often we email a summary of non-urgent updates."
            control={
              <NativeSelect
                value={cadence}
                onChange={(event) =>
                  setCadence(event.target.value as DigestCadence)
                }
              >
                {DIGEST_CADENCE.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {DIGEST_LABELS[value]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            }
          />
        </SettingsCard>
      </section>

      <SaveBar
        disabled={!dirty}
        loading={update.isPending}
        label="Save preferences"
        onSave={onSubmit}
        left={
          dirty ? (
            <Badge
              variant="warning"
              className="font-mono text-[10px] tracking-wide uppercase"
            >
              Unsaved changes
            </Badge>
          ) : (
            <Badge
              variant="success"
              className="font-mono text-[10px] tracking-wide uppercase"
            >
              All saved
            </Badge>
          )
        }
      />
    </form>
  )
}
