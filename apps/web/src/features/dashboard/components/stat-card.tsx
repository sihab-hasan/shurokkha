import * as React from "react"
import type { LucideIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

export interface StatCardProps {
  title: string
  icon: LucideIcon
  value: string
  description: string
  actions?: React.ReactNode
}

export function StatCard({
  title,
  icon: Icon,
  value,
  description,
  actions,
}: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {actions && <div className="mt-4 flex gap-2">{actions}</div>}
      </CardContent>
    </Card>
  )
}
