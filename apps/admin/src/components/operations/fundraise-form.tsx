"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { Textarea } from "@shurokkha/ui/components/textarea"

import { FUNDRAISE_STATUSES } from "@shurokkha/contracts"

import { adminRoutes } from "@/config/routes"
import { useFundraises } from "@/hooks/operations/use-fundraises"
import type { FundraiseStatus } from "@/hooks/operations/types"

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function FundraiseForm() {
  const router = useRouter()
  const { create } = useFundraises()

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [summary, setSummary] = useState("")
  const [description, setDescription] = useState("")
  const [goalAmount, setGoalAmount] = useState<string>("")
  const [raisedAmount, setRaisedAmount] = useState<string>("0")
  const [currency, setCurrency] = useState("BDT")
  const [status, setStatus] = useState<FundraiseStatus>("active")
  const [coverImagePath, setCoverImagePath] = useState("")
  const [beneficiaryName, setBeneficiaryName] = useState("")
  const [startsAt, setStartsAt] = useState("")
  const [endsAt, setEndsAt] = useState("")

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !description || !goalAmount) return

    create.mutate(
      {
        title,
        slug,
        summary: summary || null,
        description,
        cover_image_path: coverImagePath || null,
        goal_amount: Number(goalAmount),
        raised_amount: Number(raisedAmount || 0),
        currency,
        status,
        beneficiary_name: beneficiaryName || null,
        starts_at: startsAt ? new Date(startsAt).toISOString() : null,
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      },
      {
        onSuccess: () => {
          setTitle("")
          setSlug("")
          setDescription("")
          setGoalAmount("")
          router.push(adminRoutes.operations.fundraises.list)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Sylhet flood relief campaign"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value))
            setSlugTouched(true)
          }}
          placeholder="sylhet-flood-relief-campaign"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Short pitch shown on listing pages."
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Full description of the campaign..."
          rows={6}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="goal_amount">Goal Amount *</Label>
          <Input
            id="goal_amount"
            type="number"
            min="0"
            step="1"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            placeholder="500000"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="raised_amount">Raised So Far</Label>
          <Input
            id="raised_amount"
            type="number"
            min="0"
            step="1"
            value={raisedAmount}
            onChange={(e) => setRaisedAmount(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="BDT"
            maxLength={8}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <NativeSelect
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as FundraiseStatus)}
          >
            {FUNDRAISE_STATUSES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="beneficiary_name">Beneficiary</Label>
          <Input
            id="beneficiary_name"
            value={beneficiaryName}
            onChange={(e) => setBeneficiaryName(e.target.value)}
            placeholder="Sunamganj flood victims"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cover_image_path">Cover Image URL</Label>
        <Input
          id="cover_image_path"
          value={coverImagePath}
          onChange={(e) => setCoverImagePath(e.target.value)}
          placeholder="https://cdn.shurokkha.bd/campaigns/cover.jpg"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="starts_at">Starts At</Label>
          <Input
            id="starts_at"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ends_at">Ends At</Label>
          <Input
            id="ends_at"
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={create.isPending}>
        {create.isPending ? "Creating…" : "Create Campaign"}
      </Button>
    </form>
  )
}
