"use client"

import type {
  DonationKind,
  DonationPaymentMethod,
  DonationStatus,
} from "@shurokkha/contracts"
import { Input } from "@shurokkha/ui/components/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"

import { titleCase } from "@/features/shared/formatters"

import { useDonationsQuery } from "../hooks/use-donations-query"

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
] as const satisfies readonly DonationStatus[]

const TYPE_OPTIONS = [
  "one_time",
  "recurring",
  "zakat",
  "sadaqah",
  "general",
] as const satisfies readonly DonationKind[]

const METHOD_OPTIONS = [
  "bkash",
  "nagad",
  "rocket",
  "bank",
  "card",
] as const satisfies readonly DonationPaymentMethod[]

/**
 * Search + filter strip for the donations page.
 *
 * Single-select filters — one value at a time per dimension. The
 * underlying state is a single value, not an array, so the trigger
 * label always reads "All X" or "X name" with no "N selected" wording.
 */
export function DonationsToolbar() {
  const {
    searchDraft,
    setSearchDraft,
    status,
    setStatus,
    type,
    setType,
    payment_method,
    setPaymentMethod,
    commitSearch,
  } = useDonationsQuery()

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_10rem_10rem]">
      <Input
        value={searchDraft}
        onChange={(event) => setSearchDraft(event.target.value)}
        placeholder="Search campaign or receipt"
        maxLength={100}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            commitSearch()
          }
        }}
        aria-label="Search donations"
      />
      <NativeSelect
        aria-label="Filter by status"
        className="w-full"
        value={status ?? ""}
        onChange={(event) =>
          setStatus(
            event.target.value ? (event.target.value as DonationStatus) : null
          )
        }
      >
        <NativeSelectOption value="">All statuses</NativeSelectOption>
        {STATUS_OPTIONS.map((value) => (
          <NativeSelectOption key={value} value={value}>
            {titleCase(value)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <NativeSelect
        aria-label="Filter by type"
        className="w-full"
        value={type ?? ""}
        onChange={(event) =>
          setType(
            event.target.value ? (event.target.value as DonationKind) : null
          )
        }
      >
        <NativeSelectOption value="">All types</NativeSelectOption>
        {TYPE_OPTIONS.map((value) => (
          <NativeSelectOption key={value} value={value}>
            {titleCase(value)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <NativeSelect
        aria-label="Filter by payment method"
        className="w-full"
        value={payment_method ?? ""}
        onChange={(event) =>
          setPaymentMethod(
            event.target.value
              ? (event.target.value as DonationPaymentMethod)
              : null
          )
        }
      >
        <NativeSelectOption value="">All methods</NativeSelectOption>
        {METHOD_OPTIONS.map((value) => (
          <NativeSelectOption key={value} value={value}>
            {titleCase(value)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  )
}
