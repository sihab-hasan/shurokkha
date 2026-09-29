"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { Textarea } from "@shurokkha/ui/components/textarea"

import { GUIDE_CATEGORIES, GUIDE_STATUSES } from "@shurokkha/contracts"

import { adminRoutes } from "@/config/routes"
import { useGuides } from "@/hooks/operations/use-guides"
import type { GuideCategory, GuideStatus } from "@/hooks/operations/types"

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function GuideForm() {
  const router = useRouter()
  const { create } = useGuides()

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [summary, setSummary] = useState("")
  const [body, setBody] = useState("")
  const [category, setCategory] = useState<GuideCategory>("preparedness")
  const [status, setStatus] = useState<GuideStatus>("draft")
  const [readingTime, setReadingTime] = useState<string>("5")
  const [coverImagePath, setCoverImagePath] = useState("")
  const [publishedAt, setPublishedAt] = useState("")

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !body) return

    create.mutate(
      {
        title,
        slug,
        summary: summary || null,
        body,
        category,
        status,
        cover_image_path: coverImagePath || null,
        reading_time_minutes: Number(readingTime || 0),
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      },
      {
        onSuccess: () => {
          setTitle("")
          setSlug("")
          setBody("")
          router.push(adminRoutes.operations.guides.list)
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
          placeholder="Flood safety: 10 things to do before the water rises"
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
          placeholder="flood-safety-10-things-to-do"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="One-paragraph overview shown in resource lists."
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Body *</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the full guide body..."
          rows={10}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="category">Category *</Label>
          <NativeSelect
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as GuideCategory)}
          >
            {GUIDE_CATEGORIES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <NativeSelect
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as GuideStatus)}
          >
            {GUIDE_STATUSES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reading_time_minutes">Reading Time (min)</Label>
          <Input
            id="reading_time_minutes"
            type="number"
            min="0"
            step="1"
            value={readingTime}
            onChange={(e) => setReadingTime(e.target.value)}
            placeholder="5"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cover_image_path">Cover Image URL</Label>
        <Input
          id="cover_image_path"
          value={coverImagePath}
          onChange={(e) => setCoverImagePath(e.target.value)}
          placeholder="https://cdn.shurokkha.bd/guides/cover.jpg"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="published_at">Published At</Label>
        <Input
          id="published_at"
          type="datetime-local"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={create.isPending}>
        {create.isPending ? "Publishing…" : "Publish Guide"}
      </Button>
    </form>
  )
}
