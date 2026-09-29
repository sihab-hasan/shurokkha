"use client"

import Link from "next/link"
import { ArrowLeft, HandCoins, Trash2 } from "lucide-react"

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
import { useFundraise } from "@/hooks/operations/use-fundraises"

import { statusBadgeClass } from "./badges"

const formatAmount = (value: number, currency: string) => {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  })
  return `${currency} ${formatter.format(value)}`
}

export function FundraiseDetails({ fundraiseId }: { fundraiseId: number }) {
  const { fundraise, isLoading, remove } = useFundraise(fundraiseId)

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading campaign...
      </div>
    )
  }

  if (!fundraise) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Campaign #{fundraiseId} not found.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.operations.fundraises.list} />}
          >
            <ArrowLeft className="size-4" /> Back to list
          </Button>
        </CardContent>
      </Card>
    )
  }

  const pct =
    fundraise.goal_amount > 0
      ? Math.min(
          100,
          Math.round((fundraise.raised_amount / fundraise.goal_amount) * 100)
        )
      : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={adminRoutes.operations.fundraises.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Fundraises
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => remove.mutate(fundraiseId)}
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
                <HandCoins className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{fundraise.title}</CardTitle>
                <CardDescription>
                  Campaign #{fundraise.fundraise_id} · /{fundraise.slug}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={statusBadgeClass(fundraise.status)}
            >
              {fundraise.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fundraise.summary ? (
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Summary
              </p>
              <p className="mt-1 text-sm whitespace-pre-line">
                {fundraise.summary}
              </p>
            </div>
          ) : null}

          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Description
            </p>
            <p className="mt-1 text-sm whitespace-pre-line">
              {fundraise.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Goal
              </p>
              <p className="font-mono text-sm">
                {formatAmount(fundraise.goal_amount, fundraise.currency)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Raised
              </p>
              <p className="font-mono text-sm">
                {formatAmount(fundraise.raised_amount, fundraise.currency)} (
                {pct}%)
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Beneficiary
              </p>
              <p className="text-sm">{fundraise.beneficiary_name || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Organizer
              </p>
              <p className="text-sm">{fundraise.organizer_name || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Starts
              </p>
              <p className="font-mono text-sm">
                {fundraise.starts_at
                  ? new Date(fundraise.starts_at).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Ends
              </p>
              <p className="font-mono text-sm">
                {fundraise.ends_at
                  ? new Date(fundraise.ends_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
