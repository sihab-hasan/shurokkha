"use client"

import Link from "next/link"
import { ArrowLeft, BookOpen, Trash2 } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

import { adminRoutes } from "@/config/routes"
import { useGuide } from "@/hooks/operations/use-guides"

import { statusBadgeClass } from "./badges"

export function GuideDetails({ guideId }: { guideId: number }) {
  const { guide, isLoading, remove } = useGuide(guideId)

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading guide...
      </div>
    )
  }

  if (!guide) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Guide #{guideId} not found.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.guides.list} />}
          >
            <ArrowLeft className="size-4" /> Back to list
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={adminRoutes.operations.guides.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Guides
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => remove.mutate(guideId)}
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
                <BookOpen className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                <CardDescription>
                  Guide #{guide.guide_id} · /{guide.slug}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">
                {guide.category}
              </Badge>
              <Badge
                variant="outline"
                className={statusBadgeClass(guide.status)}
              >
                {guide.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {guide.summary ? (
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Summary
              </p>
              <p className="mt-1 text-sm whitespace-pre-line">
                {guide.summary}
              </p>
            </div>
          ) : null}

          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Body
            </p>
            <p className="mt-1 text-sm whitespace-pre-line">{guide.body}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Author
              </p>
              <p className="text-sm">{guide.author_name || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Reading Time
              </p>
              <p className="text-sm">{guide.reading_time_minutes} minutes</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Cover Image
              </p>
              <p className="font-mono text-xs break-all">
                {guide.cover_image_path || "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Published
              </p>
              <p className="font-mono text-sm">
                {guide.published_at
                  ? new Date(guide.published_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
