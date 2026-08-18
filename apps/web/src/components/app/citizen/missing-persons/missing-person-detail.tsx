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
} from "@shurokkha/ui-patterns/entity"

import { ApiFailure } from "@/components/app/citizen/api-feedback"
import { formatDateTime, titleCase } from "@/components/app/citizen/formatters"
import { getShurokkhaApi } from "@/lib/api"
import { routes } from "@/config/routes"
import { MissingPersonForm } from "./missing-person-form"
import { MissingPersonPhoto } from "./missing-person-photo"

export function MissingPersonDetail({ id }: { id: string }) {
  const router = useRouter()
  const [record, setRecord] = useState<MissingPersonReportRecord | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    getShurokkhaApi()
      .citizen.missingPersons.get(id)
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

  async function closeReport(located: boolean) {
    const label = located ? "mark this person as located" : "close this report"
    if (!window.confirm(`Are you sure you want to ${label}?`)) return
    setBusy(true)
    try {
      const response = await getShurokkhaApi().citizen.missingPersons.close(
        record!.id,
        located
      )
      setRecord(response.data)
      setEditing(false)
    } catch (cause) {
      setError(cause)
    } finally {
      setBusy(false)
    }
  }

  async function deleteReport() {
    if (
      !window.confirm(
        "Remove this report from your records? The server keeps a soft-deleted audit record."
      )
    )
      return
    setBusy(true)
    try {
      await getShurokkhaApi().citizen.missingPersons.remove(record!.id)
      router.push(routes.citizen.missingPersons)
      router.refresh()
    } catch (cause) {
      setError(cause)
      setBusy(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <EntityHeader
        title={record.full_name}
        subtitle="Missing-person report"
        identifier={record.id}
        status={<EntityStatus>{titleCase(record.status)}</EntityStatus>}
        breadcrumbs={
          <Button
            nativeButton={false}
            variant="ghost"
            render={<Link href={routes.citizen.missingPersons} />}
          >
            <ArrowLeft /> Back to reports
          </Button>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            {mutable ? (
              <Button
                type="button"
                variant="outline"
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
                onClick={() => closeReport(false)}
                disabled={busy}
              >
                <XCircle /> Close
              </Button>
            ) : null}
            <Button
              type="button"
              variant="destructive"
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
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="text-xs font-medium text-muted-foreground">
                Physical description
              </div>
              <p className="mt-2 text-sm leading-7">
                {record.physical_description || "Not provided"}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="text-xs font-medium text-muted-foreground">
                Distinguishing features
              </div>
              <p className="mt-2 text-sm leading-7">
                {record.distinguishing_features || "Not provided"}
              </p>
            </div>
          </div>
        </EntitySummary>
      )}
    </div>
  )
}
