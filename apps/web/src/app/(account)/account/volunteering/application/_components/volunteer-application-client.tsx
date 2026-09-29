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
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { toast } from "@shurokkha/ui/components/sonner"
import { Textarea } from "@shurokkha/ui/components/textarea"

import { useMutation, useQuery } from "@tanstack/react-query"
import { getShurokkhaApi } from "@/lib/api"

import type { VolunteerStatus } from "@shurokkha/contracts"

function statusVariant(status: VolunteerStatus) {
  if (status === "approved") return "default" as const
  if (status === "rejected") return "destructive" as const
  return "secondary" as const
}

export function VolunteerApplicationClient() {
  const { data, isLoading } = useQuery({
    queryKey: ["account", "volunteer"],
    queryFn: async () => {
      const res = await getShurokkhaApi().account.volunteer.show()
      return res.data ?? null
    },
  })

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [skills, setSkills] = useState("")
  const [availability, setAvailability] = useState("")
  const [motivation, setMotivation] = useState("")

  const submit = useMutation({
    mutationFn: async () =>
      getShurokkhaApi().account.volunteer.apply({
        full_name: fullName,
        phone,
        email: email || null,
        address: address || null,
        skills: skills || null,
        availability: availability || null,
        motivation: motivation || null,
      }),
    onSuccess: () => {
      toast.success("Volunteer application submitted.")
      setFullName("")
      setPhone("")
      setEmail("")
      setAddress("")
      setSkills("")
      setAvailability("")
      setMotivation("")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to submit application."),
  })

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <CardTitle className="text-base">Existing application</CardTitle>
          <Badge variant={statusVariant(data.status)}>{data.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">{data.full_name}</span> · {data.phone}
          </p>
          {data.email ? <p>{data.email}</p> : null}
          {data.address ? <p>{data.address}</p> : null}
          {data.skills ? (
            <p>
              <span className="text-xs tracking-wide text-muted-foreground uppercase">
                Skills
              </span>
              <br />
              {data.skills}
            </p>
          ) : null}
          {data.availability ? (
            <p>
              <span className="text-xs tracking-wide text-muted-foreground uppercase">
                Availability
              </span>
              <br />
              {data.availability}
            </p>
          ) : null}
          {data.motivation ? (
            <p>
              <span className="text-xs tracking-wide text-muted-foreground uppercase">
                Motivation
              </span>
              <br />
              {data.motivation}
            </p>
          ) : null}
          {data.review_notes ? (
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Review notes
                {data.reviewer_name ? ` · ${data.reviewer_name}` : ""}
              </p>
              <p className="mt-1 whitespace-pre-line">{data.review_notes}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Apply as a Volunteer</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!fullName || !phone) return
            submit.mutate()
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="va-name">Full name *</Label>
              <Input
                id="va-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="va-phone">Phone *</Label>
              <Input
                id="va-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="va-email">Email</Label>
              <Input
                id="va-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="va-address">Address</Label>
              <Input
                id="va-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="va-skills">Skills & certifications</Label>
            <Textarea
              id="va-skills"
              rows={3}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="First aid, boat operations, logistics, ..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="va-avail">Availability</Label>
            <Input
              id="va-avail"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Weekends, evenings, ..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="va-motive">Why do you want to volunteer?</Label>
            <Textarea
              id="va-motive"
              rows={4}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={submit.isPending}>
            {submit.isPending ? "Submitting…" : "Submit application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
