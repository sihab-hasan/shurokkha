import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import {
  CollectionFooter,
  CollectionList,
  CollectionView,
} from "@shurokkha/ui-patterns/collections"
import { WidgetFrame } from "@shurokkha/ui-patterns/dashboard"
import { EntityStatus } from "@shurokkha/ui-patterns/entity"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"

export interface AppCollectionPageProps {
  title: string
  description: string
  items: Array<{
    title: string
    description: string
    status?: string
    href?: string
  }>
  asideTitle: string
  asideDescription: string
}

type AppCollectionItemProps = AppCollectionPageProps["items"][number]

function AppCollectionItem({
  title,
  description,
  status,
  href,
}: AppCollectionItemProps) {
  const content = (
    <div className="flex min-w-0 items-start gap-3 px-5 py-4">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {status ? <EntityStatus dot={false}>{status}</EntityStatus> : null}
    </div>
  )

  return (
    <li className="min-w-0">
      {href ? (
        <Link
          href={href}
          className="block rounded-sm transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  )
}

/**
 * Web-app list/detail-summary composition.
 * Domain data stays in the app while page/list/widget structure comes from ui-patterns.
 */
export function AppCollectionPage({
  title,
  description,
  items,
  asideTitle,
  asideDescription,
}: AppCollectionPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <CollectionView
          surface="card"
          footer={
            <CollectionFooter
              summary={`${items.length} ${items.length === 1 ? "item" : "items"} available`}
            />
          }
        >
          <CollectionList>
            {items.map((item) => (
              <AppCollectionItem key={item.title} {...item} />
            ))}
          </CollectionList>
        </CollectionView>

        <WidgetFrame title={asideTitle} description={asideDescription}>
          <p className="text-sm leading-7 text-muted-foreground">
            Information shown here is synchronized with the Shurokkha response
            network and will update as new activity is confirmed.
          </p>
        </WidgetFrame>
      </div>
    </div>
  )
}
