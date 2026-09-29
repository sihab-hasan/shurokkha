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
  useComplaintMutations,
  useMyComplaints,
} from "@/features/complaints/hooks/use-complaints"

import {
  COMPLAINT_CATEGORIES,
  type ComplaintCategory,
} from "@shurokkha/contracts"

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  under_review: "border-blue-500/30 bg-blue-500/15 text-blue-700",
  resolved: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  rejected: "border-destructive/30 bg-destructive/15 text-destructive",
}

export function ComplaintsClient() {
  const { data, isLoading } = useMyComplaints()
  const { submit } = useComplaintMutations()

  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<ComplaintCategory>("general")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !description) return
    submit.mutate(
      { subject, description, category },
      {
        onSuccess: () => {
          setSubject("")
          setDescription("")
          setCategory("general")
        },
      }
    )
  }

  const complaints = data ?? []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">File a complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <NativeSelect
                id="category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ComplaintCategory)
                }
              >
                {COMPLAINT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Short summary"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="What happened, when, and where?"
                required
              />
            </div>
            <Button type="submit" disabled={submit.isPending}>
              {submit.isPending ? "Submitting…" : "Submit complaint"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your complaints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : complaints.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No complaints filed yet.
            </p>
          ) : (
            complaints.map((c) => (
              <div
                key={c.complaint_id}
                className="rounded-md border p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{c.subject}</div>
                  <Badge
                    variant="outline"
                    className={
                      STATUS_STYLES[c.status] ??
                      "border-muted-foreground/30 bg-muted text-muted-foreground"
                    }
                  >
                    {c.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {c.category} · #{c.complaint_id}
                  {c.created_at
                    ? ` · ${new Date(c.created_at).toLocaleString()}`
                    : ""}
                </div>
                <p className="mt-1 text-sm text-foreground/80">
                  {c.description}
                </p>
                {c.resolution_notes ? (
                  <p className="mt-2 rounded bg-muted/40 p-2 text-xs text-muted-foreground">
                    <span className="font-semibold">Resolution:</span>{" "}
                    {c.resolution_notes}
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
