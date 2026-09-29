"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Trash2, UserPlus } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"

import { VOLUNTEER_STATUSES } from "@shurokkha/contracts"

import { adminRoutes } from "@/config/routes"
import { useVolunteer } from "@/hooks/operations/use-volunteers"

import { statusBadgeClass } from "./badges"

type ReviewDecision = "approved" | "rejected"

export function VolunteerDetails({ volunteerId }: { volunteerId: number }) {
  const { volunteer, isLoading, review, remove } = useVolunteer(volunteerId)

  const [status, setStatus] = useState<ReviewDecision>("approved")
  const [reviewNotes, setReviewNotes] = useState("")

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading application...
      </div>
    )
  }

  if (!volunteer) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Volunteer application #{volunteerId} not found.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.volunteers.list} />}
          >
            <ArrowLeft className="size-4" /> Back to list
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault()
    review.mutate(
      {
        id: volunteerId,
        input: {
          status,
          review_notes: reviewNotes || null,
        },
      },
      {
        onSuccess: () => setReviewNotes(""),
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={adminRoutes.operations.volunteers.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Volunteers
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => remove.mutate(volunteerId)}
          disabled={remove.isPending}
        >
          <Trash2 className="size-4" /> Delete
        </Button>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <UserPlus className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{volunteer.full_name}</CardTitle>
                <CardDescription>
                  Application #{volunteer.volunteer_id}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={statusBadgeClass(volunteer.status)}
            >
              {volunteer.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Phone
              </p>
              <p className="font-mono text-sm">{volunteer.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Email
              </p>
              <p className="text-sm break-all">{volunteer.email || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Address
              </p>
              <p className="text-sm">{volunteer.address || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Availability
              </p>
              <p className="text-sm">{volunteer.availability || "—"}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Skills
              </p>
              <p className="text-sm">{volunteer.skills || "—"}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Motivation
              </p>
              <p className="text-sm whitespace-pre-line">
                {volunteer.motivation || "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Submitted
              </p>
              <p className="font-mono text-sm">
                {volunteer.created_at
                  ? new Date(volunteer.created_at).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Reviewed By
              </p>
              <p className="text-sm">
                {volunteer.reviewer_name ||
                  (volunteer.reviewed_by
                    ? `User #${volunteer.reviewed_by}`
                    : "—")}
              </p>
            </div>
            {volunteer.review_notes ? (
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  Previous Review Notes
                </p>
                <p className="text-sm whitespace-pre-line">
                  {volunteer.review_notes}
                </p>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Review Application</CardTitle>
          <CardDescription>
            Approve, reject, or keep the application pending.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReview} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="status">Decision</Label>
              <NativeSelect
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ReviewDecision)}
              >
                {VOLUNTEER_STATUSES.filter((opt) => opt !== "pending").map(
                  (opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  )
                )}
              </NativeSelect>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="review_notes">Review Notes</Label>
              <Input
                id="review_notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Optional note for the applicant"
              />
            </div>

            <Button type="submit" disabled={review.isPending}>
              {review.isPending ? "Saving…" : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
