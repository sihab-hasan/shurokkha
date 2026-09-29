"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { toast } from "@shurokkha/ui/components/sonner"

import { useQuery } from "@tanstack/react-query"
import { getShurokkhaApi } from "@/lib/api"

import type { FeedbackStatus } from "@shurokkha/contracts"

function statusVariant(status: FeedbackStatus) {
  if (status === "pending") return "secondary" as const
  if (status === "reviewed") return "default" as const
  return "outline" as const
}

export function FeedbackDetailClient({ id }: { id: string }) {
  const numericId = Number(id)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["account", "feedback", numericId],
    queryFn: async () => {
      const res = await getShurokkhaApi().account.feedback.get(numericId)
      return res.data ?? null
    },
    enabled: Number.isFinite(numericId),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (isError) {
    toast.error(
      error instanceof Error ? error.message : "Failed to load feedback."
    )
    return null
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Feedback not found.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/account/feedback" />}
      >
        <ArrowLeft className="size-4" /> Back to feedback
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <CardTitle className="text-base">{data.subject}</CardTitle>
          <Badge variant={statusVariant(data.status)}>{data.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-2 sm:grid-cols-3">
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Category
              </p>
              <p>{data.category}</p>
            </div>
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Rating
              </p>
              <p>{data.rating != null ? `${data.rating}/5` : "—"}</p>
            </div>
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Submitted
              </p>
              <p>
                {data.created_at
                  ? new Date(data.created_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Message
            </p>
            <p className="mt-1 whitespace-pre-line">{data.message}</p>
          </div>

          {data.response ? (
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Team Response
                {data.reviewer_name ? ` · ${data.reviewer_name}` : ""}
              </p>
              <p className="mt-1 whitespace-pre-line">{data.response}</p>
              {data.reviewed_at ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(data.reviewed_at).toLocaleString()}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No response yet — the coordination team reviews feedback weekly.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
