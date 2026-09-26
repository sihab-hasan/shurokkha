"use client"

import type {
  AssistanceRequestPriority,
  AssistanceRequestStatus,
  AssistanceRequestType,
} from "@shurokkha/contracts"
import { Input } from "@shurokkha/ui/components/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"

import { titleCase } from "@/features/shared/formatters"

import { useAssistanceQuery } from "../hooks/use-assistance-query"

const STATUS_OPTIONS = [
  "submitted",
  "verified",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
  "cancelled",
] as const satisfies readonly AssistanceRequestStatus[]

const TYPE_OPTIONS = [
  "rescue",
  "medical",
  "essentials",
  "shelter",
  "other",
] as const satisfies readonly AssistanceRequestType[]

const PRIORITY_OPTIONS = [
  "critical",
  "high",
  "normal",
] as const satisfies readonly AssistanceRequestPriority[]

/**
 * Search + filter strip for the assistance page.
 *
 * Single-select filters — one value at a time per dimension. The
 * underlying state is a single value, not an array, so the trigger
 * label always reads "All X" or "X name" with no "N selected" wording.
 */
export function AssistanceToolbar() {
  const {
    searchDraft,
    setSearchDraft,
    status,
    setStatus,
    type,
    setType,
    priority,
    setPriority,
    commitSearch,
  } = useAssistanceQuery()

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_10rem_10rem]">
      <Input
        value={searchDraft}
        onChange={(event) => setSearchDraft(event.target.value)}
        placeholder="Search description or address"
        maxLength={100}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            commitSearch()
          }
        }}
        aria-label="Search requests"
      />
      <NativeSelect
        aria-label="Filter by status"
        className="w-full"
        value={status ?? ""}
        onChange={(event) =>
          setStatus(
            event.target.value
              ? (event.target.value as AssistanceRequestStatus)
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
      <NativeSelect
        aria-label="Filter by type"
        className="w-full"
        value={type ?? ""}
        onChange={(event) =>
          setType(
            event.target.value
              ? (event.target.value as AssistanceRequestType)
              : null
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
        aria-label="Filter by priority"
        className="w-full"
        value={priority ?? ""}
        onChange={(event) =>
          setPriority(
            event.target.value
              ? (event.target.value as AssistanceRequestPriority)
              : null
          )
        }
      >
        <NativeSelectOption value="">All priorities</NativeSelectOption>
        {PRIORITY_OPTIONS.map((value) => (
          <NativeSelectOption key={value} value={value}>
            {titleCase(value)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  )
}
