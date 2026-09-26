"use client"

import type { MissingPersonStatus } from "@shurokkha/contracts"
import { Input } from "@shurokkha/ui/components/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"

import { titleCase } from "@/features/shared/formatters"

import { useMissingPersonsQuery } from "../hooks/use-missing-persons-query"

const STATUS_OPTIONS = [
  "reported",
  "under_review",
  "verified",
  "searching",
  "located",
  "closed",
  "rejected",
] as const satisfies readonly MissingPersonStatus[]

/**
 * Search + filter strip for the missing-persons page.
 *
 * Single-select — the trigger label is always "All statuses" or a single
 * status name; no "N selected" wording.
 */
export function MissingPersonToolbar() {
  const { searchDraft, setSearchDraft, status, setStatus, commitSearch } =
    useMissingPersonsQuery()

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
      <Input
        value={searchDraft}
        onChange={(event) => setSearchDraft(event.target.value)}
        placeholder="Search name or last seen location"
        maxLength={100}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            commitSearch()
          }
        }}
        aria-label="Search reports"
      />
      <NativeSelect
        aria-label="Filter by status"
        className="w-full"
        value={status ?? ""}
        onChange={(event) =>
          setStatus(
            event.target.value
              ? (event.target.value as MissingPersonStatus)
              : null
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
    </div>
  )
}
