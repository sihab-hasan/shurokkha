"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Pencil, Trash2, XCircle } from "lucide-react"

import type { MissingPersonReportRecord } from "@shurokkha/contracts"
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
import { useCloseMissingPerson } from "../hooks/use-close-missing-person"
import { useDeleteMissingPerson } from "../hooks/use-delete-missing-person"
import { MissingPersonForm } from "./missing-person-form"
import { MissingPersonPhoto } from "./missing-person-photo"

export function MissingPersonDetail({ id }: { id: string }) {
  const router = useRouter()
  const [record, setRecord] = useState<MissingPersonReportRecord | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const closeMutation = useCloseMissingPerson()
  const deleteMutation = useDeleteMissingPerson()
  const busy = closeMutation.isPending || deleteMutation.isPending

  useEffect(() => {
    let active = true
    getShurokkhaApi()
      .resources.missingPersons.get(id)
      .then((response) => active && setRecord(response.data))
      .catch((cause) => active && setError(cause))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  if (loading)
    return <div className="text-sm text-muted-foreground">Loading report…</div>
  if (!record)
    return (
      <ApiFailure error={error} fallback="Missing-person report not found." />
    )

  const mutable = !["located", "closed", "rejected"].includes(record.status)

  function closeReport(located: boolean) {
    const label = located ? "mark this person as located" : "close this report"
    if (!window.confirm(`Are you sure you want to ${label}?`)) return
    closeMutation.mutate(
      { id: record!.id, located },
      {
        onSuccess: (updated) => {
          setRecord(updated)
          setEditing(false)
        },
        onError: (cause) => setError(cause),
      }
    )
  }

  function deleteReport() {
    if (
      !window.confirm(
        "Remove this report from your records? The server keeps a soft-deleted audit record."
      )
    )
      return
    deleteMutation.mutate(
      { id: record!.id },
      {
        onSuccess: () => {
          router.push(routes.account.missingPersons)
          router.refresh()
        },
        onError: (cause) => setError(cause),
      }
    )
  }

  return (
    // `min-w-0` lets this detail body shrink below intrinsic width so
    // descendants (EntityMetadata grid, EntityHeader) can fit inside the
    // modal without forcing horizontal scroll.
    <div className="min-w-0 space-y-6">
      <EntityHeader
        title={record.full_name}
        subtitle="Missing-person report"
        identifier={record.id}
        status={<EntityStatus>{titleCase(record.status)}</EntityStatus>}
        breadcrumbs={
          <Button
            nativeButton={false}
            variant="ghost"
            render={<Link href={routes.account.missingPersons} />}
          >
            <ArrowLeft /> Back to reports
          </Button>
        }
        actions={
          // Buttons wrap onto multiple lines if the modal is narrow.
          // `size="sm"` keeps each button compact so 3-4 fit comfortably
          // in a single row at sm:max-w-2xl, and wrap cleanly otherwise.
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
                onClick={() => closeReport(true)}
                disabled={busy}
              >
                <CheckCircle2 /> Mark located
              </Button>
            ) : null}
            {mutable ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => closeReport(false)}
                disabled={busy}
              >
                <XCircle /> Close
              </Button>
            ) : null}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={deleteReport}
              disabled={busy}
            >
              <Trash2 /> Delete
            </Button>
          </div>
        }
      />

      {error ? <ApiFailure error={error} /> : null}

      {editing ? (
        <MissingPersonForm
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
          title="Report details"
          description={`Created ${formatDateTime(record.created_at)}`}
        >
          <MissingPersonPhoto
            id={record.id}
            name={record.full_name}
            hasPhoto={record.has_photo}
          />
          <EntityMetadata
            items={[
              { label: "Age", value: record.age ?? "Not provided" },
              {
                label: "Gender",
                value: record.gender
                  ? titleCase(record.gender)
                  : "Not provided",
              },
              { label: "Contact phone", value: record.contact_phone },
              {
                label: "Last seen",
                value: formatDateTime(record.last_seen_at),
              },
              { label: "Last seen location", value: record.last_seen_location },
              {
                label: "Coordinates",
                value:
                  record.latitude != null && record.longitude != null
                    ? `${record.latitude}, ${record.longitude}`
                    : "Not provided",
              },
              { label: "Found at", value: formatDateTime(record.found_at) },
              { label: "Closed at", value: formatDateTime(record.closed_at) },
            ]}
          />
          {/* `min-w-0` on the grid + each cell lets the two-column
              layout collapse to a single column on narrow widths AND
              lets long descriptions wrap inside their own card. */}
          <div className="mt-6 grid min-w-0 gap-4 md:grid-cols-2">
            <div className="min-w-0 rounded-lg bg-muted/50 p-4">
              <div className="text-xs font-medium text-muted-foreground">
                Physical description
              </div>
              <p className="mt-2 text-sm leading-7 break-words whitespace-pre-wrap">
                {record.physical_description || "Not provided"}
              </p>
            </div>
            <div className="min-w-0 rounded-lg bg-muted/50 p-4">
              <div className="text-xs font-medium text-muted-foreground">
                Distinguishing features
              </div>
              <p className="mt-2 text-sm leading-7 break-words whitespace-pre-wrap">
                {record.distinguishing_features || "Not provided"}
              </p>
            </div>
          </div>
        </EntitySummary>
      )}
    </div>
  )
}
