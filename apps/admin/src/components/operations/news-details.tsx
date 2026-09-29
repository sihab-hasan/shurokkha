"use client"

import Link from "next/link"
import { ArrowLeft, Newspaper, Trash2 } from "lucide-react"

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
import { useNewsArticle } from "@/hooks/operations/use-news"

import { statusBadgeClass } from "./badges"

export function NewsDetails({ articleId }: { articleId: number }) {
  const { article, isLoading, remove } = useNewsArticle(articleId)

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading article...
      </div>
    )
  }

  if (!article) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Article #{articleId} not found.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.news.list} />}
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
          render={<Link href={adminRoutes.operations.news.list} />}
        >
          <ArrowLeft className="size-4" /> Back to News
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => remove.mutate(articleId)}
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
                <Newspaper className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{article.title}</CardTitle>
                <CardDescription>
                  Article #{article.news_id} · /{article.slug}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">
                {article.category}
              </Badge>
              <Badge
                variant="outline"
                className={statusBadgeClass(article.status)}
              >
                {article.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {article.excerpt ? (
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Excerpt
              </p>
              <p className="mt-1 text-sm whitespace-pre-line">
                {article.excerpt}
              </p>
            </div>
          ) : null}

          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Body
            </p>
            <p className="mt-1 text-sm whitespace-pre-line">{article.body}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Author
              </p>
              <p className="text-sm">{article.author_name || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Cover Image
              </p>
              <p className="font-mono text-xs break-all">
                {article.cover_image_path || "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Published
              </p>
              <p className="font-mono text-sm">
                {article.published_at
                  ? new Date(article.published_at).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Created
              </p>
              <p className="font-mono text-sm">
                {article.created_at
                  ? new Date(article.created_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
