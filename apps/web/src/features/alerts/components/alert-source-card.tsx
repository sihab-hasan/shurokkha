import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

export interface AlertSourceCardProps {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

/**
 * One official alert/information source card. Renders the icon glyph, a
 * short description, and a single "Open source" outbound action. Used on
 * `/emergency-alerts` to enumerate trusted Bangladesh information sources.
 */
export function AlertSourceCard({
  title,
  description,
  href,
  icon: Icon,
}: AlertSourceCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="leading-6">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link href={href} />}
        >
          Open source
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  )
}
