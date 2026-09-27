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

export interface NewsSectionCardProps {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

/**
 * One news lens card (response / recovery / platform). Renders the
 * icon, headline, description, and a single "Open section" outbound
 * action that links to the relevant public page.
 */
export function NewsSectionCard({
  title,
  description,
  href,
  icon: Icon,
}: NewsSectionCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="leading-6">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link href={href} />}
        >
          Open section
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  )
}
