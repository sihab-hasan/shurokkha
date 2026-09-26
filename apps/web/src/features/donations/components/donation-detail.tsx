"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, XCircle } from "lucide-react"

import type { DonationRecord } from "@shurokkha/contracts"
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

interface DonationDetailProps {
  /** Either the receipt number ("DON-000481") or the numeric id. */
  id: string
}

/**
 * Renders a single donation receipt inside the modal/drawer or the
 * dedicated detail page.
 *
 * Resolves the record by trying the numeric id first (most common case
 * when navigating from the list) and falls back to looking it up by
 * `receipt_number` via a fresh list query when that fails (URL was
 * crafted by hand or copied from a printed receipt).
 */
export function DonationDetail({ id }: DonationDetailProps) {
  const [record, setRecord] = useState<DonationRecord | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)

    const tryLoad = async (): Promise<DonationRecord | null> => {
      const api = getShurokkhaApi()
      // First try the literal id (works when it's numeric).
      const numericId = Number.parseInt(id, 10)
      if (Number.isFinite(numericId) && String(numericId) === id) {
        try {
          const response = await api.resources.donations.get(numericId)
          return response.data
        } catch {
          // Fall through to the receipt-number lookup.
        }
      }

      // Otherwise look up by receipt_number via the list endpoint.
      const list = await api.resources.donations.list({
        page: 1,
        per_page: 1,
      })
      const match = list.data.find((row) => row.receipt_number === id)
      return match ?? null
    }

    tryLoad()
      .then((row) => {
        if (!active) return
        setRecord(row)
      })
      .catch((cause) => {
        if (!active) return
        setError(cause)
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  async function cancelDonation() {
    if (!record) return
    if (!window.confirm("Cancel this pending donation?")) return
    setCancelling(true)
    try {
      const response = await getShurokkhaApi().resources.donations.cancel(
        record.donation_id
      )
      setRecord(response.data)
    } catch (cause) {
      setError(cause)
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading receipt…</div>
  }

  if (!record) {
    return (
      <ApiFailure
        error={error}
        fallback="We couldn't find that donation. It may have been removed."
      />
    )
  }

  const cancelable = record.status === "pending"

  return (
    <div className="min-w-0 space-y-6">
      <EntityHeader
        title={record.campaign_title ?? titleCase(record.donation_kind)}
        subtitle="Donation receipt"
        identifier={record.receipt_number ?? `#${record.donation_id}`}
        status={<EntityStatus>{titleCase(record.status)}</EntityStatus>}
        breadcrumbs={
          <Button
            nativeButton={false}
            variant="ghost"
            render={<Link href={routes.account.donations} />}
          >
            <ArrowLeft /> Back to donations
          </Button>
        }
        actions={
          cancelable ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={cancelDonation}
              disabled={cancelling}
            >
              <XCircle /> {cancelling ? "Cancelling…" : "Cancel donation"}
            </Button>
          ) : null
        }
      />

      {error ? <ApiFailure error={error} /> : null}

      <EntitySummary
        title="Receipt details"
        description={`Donated ${formatDateTime(record.created_at)}`}
      >
        <EntityMetadata
          items={[
            {
              label: "Amount",
              value: `৳${record.amount.toLocaleString()} ${record.currency}`,
            },
            {
              label: "Kind",
              value: titleCase(record.donation_kind),
            },
            {
              label: "Payment method",
              value: record.payment_method
                ? titleCase(record.payment_method)
                : "—",
            },
            {
              label: "Status",
              value: titleCase(record.status),
            },
            {
              label: "Receipt number",
              value: record.receipt_number ?? `#${record.donation_id}`,
            },
            {
              label: "Last updated",
              value: formatDateTime(record.updated_at),
            },
          ]}
        />
      </EntitySummary>
    </div>
  )
}
