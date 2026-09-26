"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2, XCircle } from "lucide-react"

import type { AssistanceRequestRecord } from "@shurokkha/contracts"
import { Button } from "@shurokkha/ui/components/button"
import {
  EntityHeader,
  EntityMetadata,
  EntityStatus,
  EntitySummary,
} from "@shurokkha/ui/components/misc"

import { ApiFailure } from "@/features/shared/api-feedback"
import { formatDateTime, titleCase } from "@/features/shared/formatters"
import { getShurokkhaApi } from "@/lib/api"
import { routes } from "@/config/routes"
import { useCancelAssistance } from "../hooks/use-cancel-assistance"
import { useDeleteAssistance } from "../hooks/use-delete-assistance"
import { AssistanceRequestForm } from "./assistance-request-form"

export function AssistanceRequestDetail({ id }: { id: string }) {
  const router = useRouter()
  const [record, setRecord] = useState<AssistanceRequestRecord | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const cancelMutation = useCancelAssistance()
  const deleteMutation = useDeleteAssistance()
  const busy = cancelMutation.isPending || deleteMutation.isPending

  useEffect(() => {
    let active = true
    getShurokkhaApi()
      .resources.assistanceRequests.get(id)
      .then((response) => active && setRecord(response.data))
      .catch((cause) => active && setError(cause))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  if (loading)
    return <div className="text-sm text-muted-foreground">Loading request…</div>
  if (!record) return <ApiFailure error={error} fallback="Request not found." />

  const mutable = !["resolved", "rejected", "cancelled"].includes(record.status)

  function cancelRequest() {
    if (!window.confirm("Cancel this assistance request?")) return
    cancelMutation.mutate(
      { id: record!.id },
      {
        onSuccess: (updated) => {
          // Keep the modal in sync with the cache patch.
          setRecord(updated)
        },
        onError: (cause) => setError(cause),
      }
    )
  }

  function deleteRequest() {
    if (
      !window.confirm(
        "Remove this request from your records? It will be retained as a soft-deleted audit record on the server."
      )
    )
      return
    deleteMutation.mutate(
      { id: record!.id },
      {
        // Navigate back BEFORE the mutation settles so the user sees
        // the row already gone from the list (the optimistic update
        // strips it on `onMutate`). If the call fails, we land back on
        // the modal so they can see the error.
        onSuccess: () => {
          router.push(routes.account.assistance)
          router.refresh()
        },
        onError: (cause) => {
          setError(cause)
        },
      }
    )
  }

  return (
    // `min-w-0` lets this detail body shrink below intrinsic width so
    // descendants (EntityMetadata grid, EntityHeader) can fit inside the
    // modal without forcing horizontal scroll.
    <div className="min-w-0 space-y-6">
      <EntityHeader
        title={`${titleCase(record.type)} assistance`}
        subtitle="Assistance request"
        identifier={record.id}
        status={<EntityStatus>{titleCase(record.status)}</EntityStatus>}
        breadcrumbs={
          <Button
            nativeButton={false}
            variant="ghost"
            render={<Link href={routes.account.assistance} />}
          >
            <ArrowLeft /> Back to requests
          </Button>
        }
        actions={
          // Buttons wrap onto multiple lines if the modal is narrow —
          // gap-2 keeps them visually grouped. `justify-end` would push
          // them off-screen on narrow widths, so the natural `flex-start`
          // is preferred: align the button row to the left so it sits
          // flush with the title block above.
          <div className="flex flex-wrap items-center gap-2">
            {mutable ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditing((value) => !value)}
                disabled={busy}
              >
                <Pencil /> {editing ? "Stop editing" : "Edit"}
              </Button>
            ) : null}
            {mutable ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={cancelRequest}
                disabled={busy}
              >
                <XCircle /> Cancel request
              </Button>
            ) : null}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={deleteRequest}
              disabled={busy}
            >
              <Trash2 /> Delete
            </Button>
          </div>
        }
      />

      {error ? <ApiFailure error={error} /> : null}

      {editing ? (
        <AssistanceRequestForm
          initial={record}
          embedded
          onCancel={() => setEditing(false)}
          onSaved={(updated) => {
            setRecord(updated)
            setEditing(false)
          }}
        />
      ) : (
        <EntitySummary
          title="Request details"
          description={`Submitted ${formatDateTime(record.submitted_at)}`}
        >
          <EntityMetadata
            items={[
              { label: "Type", value: titleCase(record.type) },
              { label: "Priority", value: titleCase(record.priority) },
              { label: "People affected", value: record.affected_people_count },
              { label: "Contact phone", value: record.contact_phone },
              { label: "Address", value: record.address },
              {
                label: "Last updated",
                value: formatDateTime(record.updated_at),
              },
            ]}
          />
          {/* `min-w-0` ensures the rounded description box can shrink
              with its parent (the EntitySummary card) at narrow widths.
              `break-words whitespace-pre-wrap` lets long unbroken strings
              wrap cleanly inside the box. */}
          <div className="mt-5 min-w-0 rounded-lg bg-muted/50 p-4 text-sm leading-7 break-words whitespace-pre-wrap">
            {record.description || (
              <span className="text-muted-foreground">
                No description provided.
              </span>
            )}
          </div>
        </EntitySummary>
      )}
    </div>
  )
}
