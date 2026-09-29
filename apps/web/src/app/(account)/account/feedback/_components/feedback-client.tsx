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
  useFeedbackMutations,
  useMyFeedback,
} from "@/features/account-lifecycle/hooks/use-account-lifecycle"

import {
  FEEDBACK_CATEGORIES,
  type FeedbackCategory,
} from "@shurokkha/contracts"

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  reviewed: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  archived: "border-muted-foreground/30 bg-muted text-muted-foreground",
}

export function FeedbackClient() {
  const { data, isLoading } = useMyFeedback()
  const { submit } = useFeedbackMutations()

  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState<FeedbackCategory>("general")
  const [rating, setRating] = useState("5")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !message) return
    submit.mutate(
      {
        subject,
        message,
        category,
        rating: Number(rating) || null,
      },
      {
        onSuccess: () => {
          setSubject("")
          setMessage("")
        },
      }
    )
  }

  const items = data ?? []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Send feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <NativeSelect
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as FeedbackCategory)
                  }
                >
                  {FEEDBACK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={submit.isPending}>
              {submit.isPending ? "Sending…" : "Send feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Past feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No feedback sent yet.
            </p>
          ) : (
            items.map((f) => (
              <div
                key={f.feedback_id}
                className="rounded-md border p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{f.subject}</div>
                  <Badge
                    variant="outline"
                    className={
                      STATUS_STYLES[f.status] ??
                      "border-muted-foreground/30 bg-muted text-muted-foreground"
                    }
                  >
                    {f.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {f.category} · #{f.feedback_id}
                  {f.created_at
                    ? ` · ${new Date(f.created_at).toLocaleString()}`
                    : ""}
                  {f.rating != null ? ` · ⭐ ${f.rating}` : ""}
                </div>
                <p className="mt-1 text-sm text-foreground/80">{f.message}</p>
                {f.response ? (
                  <p className="mt-2 rounded bg-muted/40 p-2 text-xs text-muted-foreground">
                    <span className="font-semibold">Response:</span>{" "}
                    {f.response}
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
