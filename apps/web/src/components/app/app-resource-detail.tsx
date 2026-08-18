import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { EntityHeader, EntitySummary } from "@shurokkha/ui-patterns/entity"
import { Button } from "@shurokkha/ui/components/button"

import { getShurokkhaApi } from "@/lib/api"

interface AppResourceDetailProps {
  title: string
  resourceLabel: string
  resourceId: string
  backHref: string
}

/** Authorized resource-detail scaffold using the shared entity pattern family. */
export default async function AppResourceDetail({
  title,
  resourceLabel,
  resourceId,
  backHref,
}: AppResourceDetailProps) {
  let apiStatus: { status: string; service: string; version: string } | null =
    null
  try {
    apiStatus = await getShurokkhaApi().system.health()
  } catch (error) {
    console.error("Failed to fetch from API:", error)
  }

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
        <div className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            This route is ready to load the authorized record from the API by
            its stable ID.
          </p>

          <div className="rounded-md border bg-muted p-4">
            <h4 className="mb-2 font-medium text-foreground">
              API Connection Test
            </h4>
            {apiStatus ? (
              <div className="text-green-600 dark:text-green-400">
                <p>✅ Successfully connected to Laravel API!</p>
                <p className="mt-1 rounded bg-background p-2 font-mono text-xs text-foreground">
                  {JSON.stringify(apiStatus)}
                </p>
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400">
                <p>❌ Failed to connect to API.</p>
                <p className="mt-1 text-xs">
                  Check if the Laravel backend is running on port 8000.
                </p>
              </div>
            )}
          </div>
        </div>
      </EntitySummary>
    </div>
  )
}
