"use client"

import Link from "next/link"
import { ArrowLeft, HandCoins } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { useQuery } from "@tanstack/react-query"
import { getShurokkhaApi } from "@/lib/api"

export function FundraiseArticle({ slug }: { slug: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["public", "fundraises", "article", slug],
    queryFn: async () => {
      const res = await getShurokkhaApi().public.fundraises.get(slug)
      return res
    },
  })

  const article = data?.data

  if (isPending) {
    return (
      <Section className="py-12">
        <Container className="max-w-3xl space-y-4">
          <Skeleton className="h-8 w-1/3" />
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
              <HandCoins className="mx-auto size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Campaign not found.
              </p>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href="/fundraise" />}
              >
                <ArrowLeft className="size-4" /> Back to fundraise
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Section>
    )
  }

  const pct =
    article.goal_amount > 0
      ? Math.min(
          100,
          Math.round((article.raised_amount / article.goal_amount) * 100)
        )
      : 0

  return (
    <Section className="py-12 sm:py-16">
      <Container className="max-w-3xl space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit"
          nativeButton={false}
          render={<Link href="/fundraise" />}
        >
          <ArrowLeft className="size-4" /> Back to fundraise
        </Button>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">{article.status}</Badge>
            {article.beneficiary_name ? (
              <span>Beneficiary: {article.beneficiary_name}</span>
            ) : null}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {article.title}
          </h1>
        </header>

        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono">
                {article.raised_amount.toLocaleString()} /{" "}
                {article.goal_amount.toLocaleString()} {article.currency}
              </span>
              <span className="font-mono text-muted-foreground">
                {pct}% raised
              </span>
            </div>
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href="/donate" />}
            >
              Contribute to relief
            </Button>
          </CardContent>
        </Card>

        <article className="prose prose-sm sm:prose-base max-w-none whitespace-pre-line text-foreground">
          {article.description}
        </article>
      </Container>
    </Section>
  )
}
