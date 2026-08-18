import * as React from "react"
import {
  EntityHeader,
  EntityMetadata,
  EntityStatus,
  EntitySummary,
} from "@shurokkha/ui-patterns/entity"
import { WidgetFrame } from "@shurokkha/ui-patterns/dashboard"

export interface AppProfileItem {
  label: string
  value: string
  hint?: string
  status?: string
}

export interface AppProfileProps {
  username: string
  title?: string
  description: string
  items: AppProfileItem[]
  asideTitle: string
  asideDescription: string
  actions?: React.ReactNode
  children?: React.ReactNode
  dangerZone?: React.ReactNode
}

/** Account profile composition built from the shared entity family. */
export function AppProfile({
  username,
  title = "My profile",
  description,
  items,
  asideTitle,
  asideDescription,
  actions,
  children,
  dangerZone,
}: AppProfileProps) {
  return (
    <div className="space-y-6">
      <EntityHeader
        title={title}
        subtitle={description}
        identifier={`@${username}`}
        status={<EntityStatus tone="success">Active</EntityStatus>}
        actions={actions}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <div className="space-y-6">
          <EntitySummary title="Account information">
            <EntityMetadata
              columns={2}
              items={items.map((item) => ({
                label: item.label,
                value: item.status ? (
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <span>{item.value}</span>
                    <EntityStatus dot={false}>{item.status}</EntityStatus>
                  </span>
                ) : (
                  item.value
                ),
                hint: item.hint,
              }))}
            />
          </EntitySummary>

          {children}
          {dangerZone}
        </div>

        <WidgetFrame title={asideTitle} description={asideDescription}>
          <p className="text-sm leading-7 text-muted-foreground">
            Sensitive account information remains scoped to authorized Shurokkha
            workflows and permissions.
          </p>
        </WidgetFrame>
      </div>
    </div>
  )
}
