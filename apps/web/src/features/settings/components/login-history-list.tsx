"use client"

import { Laptop, MapPin } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@shurokkha/ui/components/empty"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { SettingsRow } from "@shurokkha/ui/components/settings-row"

import { useLoginAudits } from "../hooks/use-login-audits"
import { ApiFailure } from "@/features/shared/api-feedback"
import { timeAgo } from "@/features/shared/time-ago"

export function LoginHistoryList() {
  const { data, isPending, isError, error } = useLoginAudits(20)

  if (isPending) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-6 py-3">
            <Skeleton className="size-8 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="size-6 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return <ApiFailure error={error} fallback="Could not load login history." />
  }

  if (data.length === 0) {
    return (
      <Empty className="border-0 bg-transparent py-10">
        <EmptyHeader>
          <EmptyTitle>No sign-ins recorded yet</EmptyTitle>
          <EmptyDescription>
            We&apos;ll start logging every sign-in here once you&apos;ve signed
            in a few times.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="divide-y divide-border/60">
      {data.map((audit) => {
        const isCurrent = audit.is_current_session
        const browser = audit.user_agent
          ? browserLabel(audit.user_agent)
          : "Unknown browser"
        const ip = audit.ip_address ?? "—"
        const when = audit.signed_in_at ? timeAgo(audit.signed_in_at) : "—"

        return (
          <SettingsRow
            key={audit.id}
            label={
              <div className="flex items-center gap-2">
                <span>{browser}</span>
                {isCurrent ? (
                  <Badge
                    variant="success"
                    className="font-mono text-[10px] tracking-wide uppercase"
                  >
                    This device
                  </Badge>
                ) : null}
                {!audit.successful ? (
                  <Badge
                    variant="destructive"
                    className="font-mono text-[10px] tracking-wide uppercase"
                  >
                    Failed
                  </Badge>
                ) : null}
              </div>
            }
            description={
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <MapPin className="size-3.5" />
                <span>
                  IP {ip}
                  {audit.failure_reason ? ` · ${audit.failure_reason}` : ""}
                </span>
                <span aria-hidden>·</span>
                <span>Signed in {when}</span>
                {audit.signed_out_at ? (
                  <>
                    <span aria-hidden>·</span>
                    <span>Signed out</span>
                  </>
                ) : null}
              </span>
            }
            meta={audit.signed_in_at ?? undefined}
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
    </div>
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
