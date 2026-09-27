import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

export interface FundraiseStepCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

/**
 * Single-purpose card describing one step in the responsible-fundraising
 * flow (choose campaign → share responsibly → track impact).
 */
export function FundraiseStepCard({
  title,
  description,
  icon: Icon,
}: FundraiseStepCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="leading-6">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
