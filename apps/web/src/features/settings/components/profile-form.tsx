"use client"

import * as React from "react"

import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { useProfile, useUpdateProfile } from "../hooks/use-profile"
import { ApiFailure } from "@/features/shared/api-feedback"
import { SaveBar } from "./save-bar"

export function ProfileForm() {
  const { data, isPending, isError, error } = useProfile()
  const update = useUpdateProfile()

  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [timezone, setTimezone] = React.useState("Asia/Dhaka")
  const [dirty, setDirty] = React.useState(false)

  // Seed local state once the profile loads. We use a ref so we never
  // re-seed when the user starts typing (which would clobber edits).
  const seededRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (!data || seededRef.current === String(data.id)) return
    seededRef.current = String(data.id)
    setFullName(data.full_name ?? "")
    setEmail(data.email ?? "")
    setPhone(data.phone ?? "")
    setTimezone(data.timezone ?? "Asia/Dhaka")
    setDirty(false)
  }, [data])

  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    )
  }

  if (isError) {
    return <ApiFailure error={error} fallback="Could not load your profile." />
  }

  function markDirty() {
    if (!dirty) setDirty(true)
  }

  function onSubmit() {
    if (!dirty || update.isPending) return
    update.mutate({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      timezone: timezone.trim() || "Asia/Dhaka",
    })
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <ApiFailure
        error={update.error}
        fallback="Could not save your profile."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-full-name">Full name</Label>
          <Input
            id="profile-full-name"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value)
              markDirty()
            }}
            maxLength={120}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              markDirty()
            }}
            maxLength={255}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-phone">Phone</Label>
          <Input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value)
              markDirty()
            }}
            placeholder="+880 1XXX-XXXXXX"
            maxLength={20}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-timezone">Timezone</Label>
          <Input
            id="profile-timezone"
            value={timezone}
            onChange={(event) => {
              setTimezone(event.target.value)
              markDirty()
            }}
            maxLength={64}
          />
        </div>
      </div>
      <SaveBar
        disabled={!dirty}
        loading={update.isPending}
        onSave={onSubmit}
        left={
          dirty ? (
            <span className="font-mono text-[11px] text-warning">
              Unsaved changes
            </span>
          ) : (
            <span className="font-mono text-[11px] text-muted-foreground">
              All changes saved
            </span>
          )
        }
      />
    </form>
  )
}
