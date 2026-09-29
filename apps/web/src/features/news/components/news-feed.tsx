"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Calendar, Newspaper } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { usePublicNews } from "../hooks/use-public-news"

import type { NewsRecord } from "@shurokkha/contracts"

const CATEGORIES: { key: NewsRecord["category"] | ""; label: string }[] = [
  { key: "", label: "All" },
  { key: "response", label: "Response" },
  { key: "recovery", label: "Recovery" },
  { key: "announcement", label: "Announcements" },
]

export function NewsFeed() {
  const [category, setCategory] = useState<string>("")
  const { data, isPending } = usePublicNews(
    category ? { category: category as NewsRecord["category"] } : {}
  )

  const items = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button
            key={c.key || "all"}
            variant={category === c.key ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
            <Newspaper className="size-8 opacity-50" />
            <p>
              No published news yet. Stories will appear here as the team
              publishes them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card
              key={item.news_id}
              className="h-full border-primary/10 shadow-sm transition-colors hover:border-primary/40"
            >
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{item.category}</Badge>
                  {item.published_at ? (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(item.published_at).toLocaleDateString()}
                    </span>
                  ) : null}
                </div>
                <Link
                  href={`/news/${item.slug}`}
                  className="text-lg leading-tight font-semibold hover:underline"
                >
                  {item.title}
                </Link>
                {item.excerpt ? (
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {item.excerpt}
                  </p>
                ) : null}
                <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  {item.author_name ? (
                    <span>By {item.author_name}</span>
                  ) : (
                    <span />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    nativeButton={false}
                    render={<Link href={`/news/${item.slug}`} />}
                  >
                    Read more <ArrowRight className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
