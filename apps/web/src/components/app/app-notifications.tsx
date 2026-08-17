import { BellRing } from "lucide-react"

import {
  NotificationItem,
  NotificationList,
} from "@shurokkha/ui-patterns/notifications"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export interface AppNotificationItem {
  title: string
  description: string
  unread?: boolean
}

export interface AppNotificationsProps {
  title?: string
  description: string
  items: AppNotificationItem[]
}

export function AppNotifications({
  title = "Notifications",
  description,
  items,
}: AppNotificationsProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <NotificationList
        header={
          <SectionHeader
            title="Recent updates"
            description={`${items.length} notifications`}
            align="left"
            size="sm"
            className="mb-0 max-w-none"
          />
        }
      >
        {items.map((item) => (
          <NotificationItem
            key={item.title}
            title={item.title}
            description={item.description}
            unread={item.unread}
            icon={<BellRing />}
          />
        ))}
      </NotificationList>
    </div>
  )
}
