import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

export interface VolunteerRoleCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

/**
 * Single-purpose card describing one volunteer role (field volunteer,
 * skilled responder, community lead, …). Reused by the roles grid on
 * `/volunteers`.
 */
export function VolunteerRoleCard({
  title,
  description,
  icon: Icon,
}: VolunteerRoleCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="leading-6">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
