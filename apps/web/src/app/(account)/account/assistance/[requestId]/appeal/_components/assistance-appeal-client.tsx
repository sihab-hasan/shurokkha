"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Label } from "@shurokkha/ui/components/label"
import { toast } from "@shurokkha/ui/components/sonner"
import { Textarea } from "@shurokkha/ui/components/textarea"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getShurokkhaApi } from "@/lib/api"

export function AssistanceAppealClient({ requestId }: { requestId: string }) {
  const router = useRouter()
  const qc = useQueryClient()
  const [reason, setReason] = useState("")

  const submit = useMutation({
    mutationFn: async () =>
      getShurokkhaApi().account.appeals.submit({
        subject_type: "assistance_request",
        subject_id: Number(requestId),
        reason,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["account", "appeals"] })
      toast.success("Appeal submitted.")
      router.push("/account/appeals")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to submit appeal."),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Appeal decision for request #{requestId}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!reason.trim()) return
            submit.mutate()
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason for appeal *</Label>
            <Textarea
              id="reason"
              rows={6}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why the decision should be re-evaluated..."
              required
            />
          </div>
          <Button type="submit" disabled={submit.isPending || !reason.trim()}>
            {submit.isPending ? "Submitting…" : "Submit appeal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
