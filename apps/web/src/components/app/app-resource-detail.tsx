import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { EntityHeader, EntitySummary } from "@shurokkha/ui-patterns/entity"
import { Button } from "@shurokkha/ui/components/button"

interface AppResourceDetailProps {
  title: string
  resourceLabel: string
  resourceId: string
  backHref: string
}

/** Authorized resource-detail scaffold using the shared entity pattern family. */
export default function AppResourceDetail({
  title,
  resourceLabel,
  resourceId,
  backHref,
}: AppResourceDetailProps) {
  return (
    <div className="max-w-3xl space-y-6">
      <EntityHeader
        title={title}
        subtitle={resourceLabel}
        identifier={resourceId}
        breadcrumbs={
          <Button
            nativeButton={false}
            variant="ghost"
            className="w-fit"
            render={<Link href={backHref} />}
          >
            <ArrowLeft data-icon="inline-start" />
            Back to {resourceLabel.toLowerCase()}
          </Button>
        }
      />

      <EntitySummary
        title={`${resourceLabel} details`}
        description={
          <>
            Reference ID: <span className="font-mono">{resourceId}</span>
          </>
        }
      >
        <p className="text-sm leading-7 text-muted-foreground">
          This route is ready to load the authorized record from the API by its
          stable ID.
        </p>
      </EntitySummary>
    </div>
  )
}
