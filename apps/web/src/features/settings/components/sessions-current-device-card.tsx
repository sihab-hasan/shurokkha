"use client"

import * as React from "react"
import { Laptop, MapPin, ShieldAlert } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shurokkha/ui/components/alert-dialog"
import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { SettingsCard } from "@shurokkha/ui/components/settings-card"
import { SettingsRow } from "@shurokkha/ui/components/settings-row"
import { SettingsSection } from "@shurokkha/ui/components/settings-section"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { useCurrentSession } from "../hooks/use-current-session"
import { useRevokeAllSessions, useSessionsList } from "../hooks/use-sessions"
import { ApiFailure, errorMessage } from "@/features/shared/api-feedback"
import { timeAgo } from "@/features/shared/time-ago"
import { toast } from "@shurokkha/ui/components/sonner"

export function CurrentDeviceCard() {
  const { data, isPending, isError, error } = useCurrentSession()

  return (
    <section className="space-y-4">
      <SettingsSection
        eyebrow="This device"
        title="Current session"
        description="The device and browser you are signed in with right now."
        metadata={
          data ? (
            <span className="font-mono text-[11px]">
              Last active {timeAgo(data.last_active_at)}
            </span>
          ) : null
        }
      />
      {isPending ? (
        <SettingsCard flush size="sm">
          <div className="flex items-center gap-4 px-6 py-4">
            <Skeleton className="size-10 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </SettingsCard>
      ) : isError || !data ? (
        <ApiFailure error={error} fallback="Could not load session info." />
      ) : (
        <SettingsCard flush size="sm">
          <SettingsRow
            label={
              <div className="flex items-center gap-2">
                <span>{browserLabel(data.user_agent)}</span>
                <Badge
                  variant="success"
                  className="font-mono text-[10px] tracking-wide uppercase"
                >
                  This device
                </Badge>
              </div>
            }
            description={
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <MapPin className="size-3.5" />
                <span>IP {data.ip}</span>
                <span aria-hidden>•</span>
                <span>Active {timeAgo(data.last_active_at)}</span>
              </span>
            }
            meta={data.last_active_at ?? undefined}
            control={
              <span
                aria-hidden
                className="flex size-8 items-center justify-center rounded-md border border-border/60 bg-muted text-muted-foreground"
              >
                <Laptop className="size-4" />
              </span>
            }
          />
        </SettingsCard>
      )}
    </section>
  )
}

function browserLabel(userAgent: string) {
  if (/Edg\//.test(userAgent)) return "Edge"
  if (/OPR\//.test(userAgent) || /Opera/.test(userAgent)) return "Opera"
  if (/Firefox\//.test(userAgent)) return "Firefox"
  if (/Chrome\//.test(userAgent)) return "Chrome"
  if (/Safari\//.test(userAgent)) return "Safari"
  return "Unknown browser"
}

export function ActiveSessionsCard() {
  const { data, isPending, isError, error } = useSessionsList()

  return (
    <section className="space-y-4">
      <SettingsSection
        eyebrow="All devices"
        title="Active sessions"
        description="Every device that is currently signed in to your account."
      />
      {isPending ? (
        <SettingsCard flush size="sm">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-3">
              <Skeleton className="size-8 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="size-6 rounded-full" />
            </div>
          ))}
        </SettingsCard>
      ) : isError || !data ? (
        <SettingsCard flush size="sm">
          <ApiFailure
            error={error}
            fallback="Could not load active sessions."
          />
        </SettingsCard>
      ) : data.length === 0 ? (
        <SettingsCard flush size="sm">
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No other active sessions.
          </div>
        </SettingsCard>
      ) : (
        <SettingsCard flush size="sm">
          {data.map((session) => {
            const isCurrent = session.is_current
            return (
              <SettingsRow
                key={session.id}
                label={
                  <div className="flex items-center gap-2">
                    <span>{browserLabel(session.user_agent)}</span>
                    {isCurrent ? (
                      <Badge
                        variant="success"
                        className="font-mono text-[10px] tracking-wide uppercase"
                      >
                        This device
                      </Badge>
                    ) : null}
                  </div>
                }
                description={
                  <span className="inline-flex flex-wrap items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    <span>IP {session.ip}</span>
                    <span aria-hidden>•</span>
                    <span>Last active {timeAgo(session.last_active_at)}</span>
                  </span>
                }
                meta={session.last_active_at ?? undefined}
                control={
                  <span
                    aria-hidden
                    className="flex size-8 items-center justify-center rounded-md border border-border/60 bg-muted text-muted-foreground"
                  >
                    <Laptop className="size-4" />
                  </span>
                }
              />
            )
          })}
        </SettingsCard>
      )}
    </section>
  )
}

export function SignOutEverywhereCard() {
  const sessions = useSessionsList()
  const revokeAll = useRevokeAllSessions()
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const otherSessionCount = (sessions.data?.length ?? 0) - 1

  function onConfirm() {
    revokeAll.mutate(undefined, {
      onSuccess: (data) => {
        const count = data?.revoked_count ?? 0
        toast.success(
          count === 0
            ? "No other sessions to sign out."
            : `Signed out ${count} ${count === 1 ? "session" : "sessions"}.`
        )
        setConfirmOpen(false)
      },
      onError: (error) =>
        toast.error(errorMessage(error, "Could not sign out other sessions.")),
    })
  }

  return (
    <section className="space-y-4">
      <SettingsSection
        eyebrow="Danger zone"
        title="Sign out everywhere"
        description="End every session across all other devices in one action."
      />
      <SettingsCard tone="danger" flush size="sm">
        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert
              className="mt-0.5 size-4 shrink-0 text-destructive"
              aria-hidden
            />
            <div className="space-y-1">
              <p className="text-sm font-medium">Sign out all other sessions</p>
              <p className="text-xs text-muted-foreground">
                {sessions.isPending
                  ? "Loading sessions…"
                  : otherSessionCount > 0
                    ? `You have ${otherSessionCount} other ${otherSessionCount === 1 ? "session" : "sessions"} that will be signed out. This device stays signed in.`
                    : "You have no other active sessions right now."}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-danger"
            onClick={() => setConfirmOpen(true)}
            disabled={
              revokeAll.isPending ||
              sessions.isPending ||
              otherSessionCount <= 0
            }
          >
            {revokeAll.isPending ? "Signing out…" : "Sign out all sessions"}
          </Button>
        </div>
      </SettingsCard>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent size="default">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out all other sessions?</AlertDialogTitle>
            <AlertDialogDescription>
              {otherSessionCount > 0
                ? `We'll sign out ${otherSessionCount} other ${otherSessionCount === 1 ? "device" : "devices"} immediately. This device stays signed in.`
                : "There are no other active sessions to sign out."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              size="sm"
              variant="destructive"
              onClick={(event) => {
                event.preventDefault()
                onConfirm()
              }}
              disabled={revokeAll.isPending}
            >
              {revokeAll.isPending ? "Signing out…" : "Sign out all sessions"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
