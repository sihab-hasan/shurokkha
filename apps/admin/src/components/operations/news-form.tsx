"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { Textarea } from "@shurokkha/ui/components/textarea"

import { NEWS_CATEGORIES, NEWS_STATUSES } from "@shurokkha/contracts"

import { adminRoutes } from "@/config/routes"
import { useNews } from "@/hooks/operations/use-news"
import type { NewsCategory, NewsStatus } from "@/hooks/operations/types"

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function NewsForm() {
  const router = useRouter()
  const { create } = useNews()

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [excerpt, setExcerpt] = useState("")
  const [body, setBody] = useState("")
  const [category, setCategory] = useState<NewsCategory>("general")
  const [status, setStatus] = useState<NewsStatus>("draft")
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
        excerpt: excerpt || null,
        body,
        cover_image_path: coverImagePath || null,
        category,
        status,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      },
      {
        onSuccess: () => {
          setTitle("")
          setSlug("")
          setExcerpt("")
          setBody("")
          router.push(adminRoutes.operations.news.list)
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
          placeholder="Volunteer mobilization drive begins"
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
          placeholder="volunteer-mobilization-drive-begins"
          required
        />
        <p className="text-xs text-muted-foreground">
          Used in the public URL: /news/{slug || "your-slug"}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="A short summary shown in the news listing."
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Body *</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the full article body..."
          rows={8}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="category">Category *</Label>
          <NativeSelect
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as NewsCategory)}
          >
            {NEWS_CATEGORIES.map((opt) => (
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
            onChange={(e) => setStatus(e.target.value as NewsStatus)}
          >
            {NEWS_STATUSES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cover_image_path">Cover Image URL</Label>
        <Input
          id="cover_image_path"
          value={coverImagePath}
          onChange={(e) => setCoverImagePath(e.target.value)}
          placeholder="https://cdn.shurokkha.bd/news/cover.jpg"
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
        <p className="text-xs text-muted-foreground">
          Leave blank to use the current time when status is set to published.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={create.isPending}>
        {create.isPending ? "Publishing…" : "Publish Article"}
      </Button>
    </form>
  )
}
