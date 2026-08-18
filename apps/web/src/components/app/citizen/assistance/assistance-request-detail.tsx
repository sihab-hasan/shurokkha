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
} from "@shurokkha/ui-patterns/entity"

import { ApiFailure } from "@/components/app/citizen/api-feedback"
import { formatDateTime, titleCase } from "@/components/app/citizen/formatters"
import { getShurokkhaApi } from "@/lib/api"
import { routes } from "@/config/routes"
import { AssistanceRequestForm } from "./assistance-request-form"

export function AssistanceRequestDetail({ id }: { id: string }) {
  const router = useRouter()
  const [record, setRecord] = useState<AssistanceRequestRecord | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    getShurokkhaApi()
      .citizen.assistanceRequests.get(id)
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

  async function cancelRequest() {
    if (!window.confirm("Cancel this assistance request?")) return
    setBusy(true)
    try {
      const response =
        await getShurokkhaApi().citizen.assistanceRequests.cancel(record!.id)
      setRecord(response.data)
    } catch (cause) {
      setError(cause)
    } finally {
      setBusy(false)
    }
  }

  async function deleteRequest() {
    if (
      !window.confirm(
        "Remove this request from your records? It will be retained as a soft-deleted audit record on the server."
      )
    )
      return
    setBusy(true)
    try {
      await getShurokkhaApi().citizen.assistanceRequests.remove(record!.id)
      router.push(routes.citizen.requests)
      router.refresh()
    } catch (cause) {
      setError(cause)
      setBusy(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <EntityHeader
        title={`${titleCase(record.type)} assistance`}
        subtitle="Assistance request"
        identifier={record.id}
        status={<EntityStatus>{titleCase(record.status)}</EntityStatus>}
        breadcrumbs={
          <Button
            nativeButton={false}
            variant="ghost"
            render={<Link href={routes.citizen.requests} />}
          >
            <ArrowLeft /> Back to requests
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
                onClick={cancelRequest}
                disabled={busy}
              >
                <XCircle /> Cancel request
              </Button>
            ) : null}
            <Button
              type="button"
              variant="destructive"
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
                label: "Coordinates",
                value:
                  record.latitude != null && record.longitude != null
                    ? `${record.latitude}, ${record.longitude}`
                    : "Not provided",
              },
              {
                label: "Last updated",
                value: formatDateTime(record.updated_at),
              },
            ]}
          />
          <div className="mt-5 rounded-lg bg-muted/50 p-4 text-sm leading-7">
            {record.description}
          </div>
        </EntitySummary>
      )}
    </div>
  )
}
