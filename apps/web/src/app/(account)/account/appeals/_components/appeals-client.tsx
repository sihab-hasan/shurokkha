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
  useAppealMutations,
  useMyAppeals,
} from "@/features/account-lifecycle/hooks/use-account-lifecycle"

import {
  APPEAL_SUBJECT_TYPES,
  type AppealSubjectType,
} from "@shurokkha/contracts"

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  upheld: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  denied: "border-destructive/30 bg-destructive/15 text-destructive",
}

export function AppealsClient() {
  const { data, isLoading } = useMyAppeals()
  const { submit } = useAppealMutations()

  const [subjectType, setSubjectType] =
    useState<AppealSubjectType>("assistance_request")
  const [subjectId, setSubjectId] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subjectId || !reason) return
    submit.mutate(
      {
        subject_type: subjectType,
        subject_id: Number(subjectId),
        reason,
      },
      {
        onSuccess: () => {
          setSubjectId("")
          setReason("")
        },
      }
    )
  }

  const items = data ?? []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">File an appeal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="subject_type">Subject</Label>
                <NativeSelect
                  id="subject_type"
                  value={subjectType}
                  onChange={(e) =>
                    setSubjectType(e.target.value as AppealSubjectType)
                  }
                >
                  {APPEAL_SUBJECT_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject_id">Subject ID *</Label>
                <Input
                  id="subject_id"
                  type="number"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={submit.isPending}>
              {submit.isPending ? "Submitting…" : "File appeal"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your appeals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active appeals.</p>
          ) : (
            items.map((a) => (
              <div key={a.appeal_id} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">
                    {a.subject_type.replace("_", " ")} #{a.subject_id}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      STATUS_STYLES[a.status] ??
                      "border-muted-foreground/30 bg-muted text-muted-foreground"
                    }
                  >
                    {a.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  #{a.appeal_id}
                  {a.created_at
                    ? ` · ${new Date(a.created_at).toLocaleString()}`
                    : ""}
                </div>
                <p className="mt-1 text-sm text-foreground/80">{a.reason}</p>
                {a.decision_notes ? (
                  <p className="mt-2 rounded bg-muted/40 p-2 text-xs text-muted-foreground">
                    <span className="font-semibold">Decision:</span>{" "}
                    {a.decision_notes}
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
