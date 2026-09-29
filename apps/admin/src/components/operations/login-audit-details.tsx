"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

import { adminRoutes } from "@/config/routes"
import { useLoginAudit } from "@/hooks/operations/use-login-audits"

export function LoginAuditDetails({ auditId }: { auditId: number }) {
  const { audit, isLoading } = useLoginAudit(auditId)

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading audit...
      </div>
    )
  }

  if (!audit) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Login audit #{auditId} not found.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.loginAudits.list} />}
          >
            <ArrowLeft className="size-4" /> Back to list
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href={adminRoutes.loginAudits.list} />}
      >
        <ArrowLeft className="size-4" /> Back to Audits
      </Button>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                Login Audit #{audit.audit_id}
              </CardTitle>
              <CardDescription>
                User #{audit.user_id ?? "—"} authentication event
              </CardDescription>
            </div>
            {audit.successful ? (
              <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-3" /> success
              </Badge>
            ) : (
              <Badge className="gap-1 border-destructive/30 bg-destructive/15 text-destructive">
                <XCircle className="size-3" /> failure
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              IP Address
            </p>
            <p className="font-mono text-sm">{audit.ip_address || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              User ID
            </p>
            <p className="font-mono text-sm">
              {audit.user_id != null ? `#${audit.user_id}` : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Signed In At
            </p>
            <p className="font-mono text-sm">
              {audit.signed_in_at
                ? new Date(audit.signed_in_at).toLocaleString()
                : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Signed Out At
            </p>
            <p className="font-mono text-sm">
              {audit.signed_out_at
                ? new Date(audit.signed_out_at).toLocaleString()
                : "—"}
            </p>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              User Agent
            </p>
            <p className="font-mono text-xs break-all">
              {audit.user_agent || "—"}
            </p>
          </div>
          {audit.failure_reason ? (
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Failure Reason
              </p>
              <p className="text-sm text-destructive">{audit.failure_reason}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
