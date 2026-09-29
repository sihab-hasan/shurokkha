"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, HandCoins } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { usePublicFundraises } from "@/app/(public)/transparency/_hooks/use-public-fundraises"

import type { FundraiseStatus } from "@shurokkha/contracts"

const FILTERS: { key: FundraiseStatus | ""; label: string }[] = [
  { key: "", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "paused", label: "Paused" },
]

export function FundraiseFeed() {
  const [status, setStatus] = useState<FundraiseStatus | "">("active")
  const { data, isPending } = usePublicFundraises(
    status ? { status: status as FundraiseStatus } : {}
  )

  const items = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.key || "all"}
            size="sm"
            variant={status === f.key ? "default" : "outline"}
            onClick={() => setStatus(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
            <HandCoins className="size-8 opacity-50" />
            <p>No campaigns match this filter yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => {
            const pct =
              c.goal_amount > 0
                ? Math.min(
                    100,
                    Math.round((c.raised_amount / c.goal_amount) * 100)
                  )
                : 0
            return (
              <Card
                key={c.fundraise_id}
                className="flex h-full flex-col border-primary/10 shadow-sm transition-colors hover:border-primary/40"
              >
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline">{c.status}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      {pct}%
                    </span>
                  </div>
                  <Link
                    href={`/fundraise/${c.slug}`}
                    className="text-lg leading-tight font-semibold hover:underline"
                  >
                    {c.title}
                  </Link>
                  {c.summary ? (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {c.summary}
                    </p>
                  ) : null}
                  <div className="mt-auto space-y-1">
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {c.raised_amount.toLocaleString()} /{" "}
                        {c.goal_amount.toLocaleString()} {c.currency}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        nativeButton={false}
                        render={<Link href={`/fundraise/${c.slug}`} />}
                      >
                        Details <ArrowRight className="size-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
