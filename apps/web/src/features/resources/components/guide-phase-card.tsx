import { ArrowRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

export interface GuidePhaseCardProps {
  label: string
  summary: string
  bullets: string[]
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

/**
 * One phase card (Prepare / Respond / Evacuate / Recover) on
 * `/resources/guides`. Renders the phase label, summary headline,
 * canonical-source disclaimer, and the bullet checklist.
 */
export function GuidePhaseCard({
  label,
  summary,
  bullets,
  icon: Icon,
}: GuidePhaseCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </p>
        <CardTitle className="text-lg">{summary}</CardTitle>
        <CardDescription className="leading-6">
          Use this checklist in addition to official Bangladesh guidance from
          BMD, the Department of Disaster Management, and your local
          administration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
          {bullets.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <ArrowRight
                className="mt-1 size-3.5 shrink-0 text-primary"
                aria-hidden
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
