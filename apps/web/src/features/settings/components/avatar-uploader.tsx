"use client"

import * as React from "react"
import { Camera, Trash2, User } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import {
  useDestroyAvatar,
  useProfile,
  useUploadAvatar,
} from "../hooks/use-profile"
import { ApiFailure } from "@/features/shared/api-feedback"
import { timeAgo } from "@/features/shared/time-ago"

export function AvatarUploader() {
  const { data, isPending, isError, error } = useProfile()
  const upload = useUploadAvatar()
  const destroy = useDestroyAvatar()

  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  function pickFile() {
    fileInputRef.current?.click()
  }

  async function onFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = "" // allow re-picking the same file later
    if (!file) return
    upload.mutate(file)
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    )
  }

  if (isError) {
    return <ApiFailure error={error} fallback="Could not load your avatar." />
  }

  const avatarUrl = data?.avatar_url ?? null
  const initials = (data?.full_name || data?.email || "?")
    .trim()
    .slice(0, 1)
    .toUpperCase()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div
          className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted text-muted-foreground"
          aria-label="Account avatar"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold" aria-hidden>
              {initials === "?" ? <User className="size-7" /> : initials}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {data?.full_name ?? "Unnamed user"}
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            Updated {timeAgo(data?.updated_at)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={pickFile}
          disabled={upload.isPending || destroy.isPending}
        >
          <Camera className="mr-1.5 size-3.5" />
          {upload.isPending ? "Uploading…" : avatarUrl ? "Replace" : "Upload"}
        </Button>
        {avatarUrl ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => destroy.mutate()}
            disabled={upload.isPending || destroy.isPending}
          >
            <Trash2 className="mr-1.5 size-3.5" />
            Remove
          </Button>
        ) : null}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onFileSelected}
        />
      </div>
    </div>
  )
}
