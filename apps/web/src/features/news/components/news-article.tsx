"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, Newspaper } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { usePublicNewsArticle } from "../hooks/use-public-news"

export function NewsArticle({ slug }: { slug: string }) {
  const { data, isPending, isError } = usePublicNewsArticle(slug)
  const article = data?.data

  if (isPending) {
    return (
      <Section className="py-12">
        <Container className="max-w-3xl space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-72 w-full" />
        </Container>
      </Section>
    )
  }

  if (isError || !article) {
    return (
      <Section className="py-12">
        <Container className="max-w-3xl">
          <Card>
            <CardContent className="space-y-3 py-12 text-center">
              <Newspaper className="mx-auto size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Story not found or not yet published.
              </p>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href="/news" />}
              >
                <ArrowLeft className="size-4" /> Back to news
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Section>
    )
  }

  return (
    <Section className="py-12 sm:py-16">
      <Container className="max-w-3xl space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit"
          nativeButton={false}
          render={<Link href="/news" />}
        >
          <ArrowLeft className="size-4" /> Back to news
        </Button>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">{article.category}</Badge>
            {article.published_at ? (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(article.published_at).toLocaleDateString()}
              </span>
            ) : null}
            {article.author_name ? <span>· {article.author_name}</span> : null}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {article.title}
          </h1>
        </header>

        <article className="prose prose-sm sm:prose-base max-w-none whitespace-pre-line text-foreground">
          {article.body}
        </article>
      </Container>
    </Section>
  )
}
