"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"

import type {
  MissingPersonReportRecord,
  MissingPersonStatus,
  PaginatedResource,
} from "@shurokkha/contracts"
import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@shurokkha/ui/components/empty"
import {
  CollectionFooter,
  CollectionList,
  CollectionView,
} from "@shurokkha/ui-patterns/collections"
import { EntityStatus } from "@shurokkha/ui-patterns/entity"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"

import { ApiFailure } from "@/components/app/citizen/api-feedback"
import { formatDateTime, titleCase } from "@/components/app/citizen/formatters"
import { getShurokkhaApi } from "@/lib/api"
import { routes } from "@/config/routes"

function statusTone(status: MissingPersonStatus) {
  if (status === "located") return "success" as const
  if (status === "closed" || status === "rejected") return "danger" as const
  if (status === "verified" || status === "searching") return "info" as const
  return "warning" as const
}

export function MissingPersonList() {
  const [result, setResult] =
    useState<PaginatedResource<MissingPersonReportRecord> | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchDraft, setSearchDraft] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"" | MissingPersonStatus>("")

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getShurokkhaApi()
      .citizen.missingPersons.list({
        page,
        per_page: 10,
        search: search || undefined,
        status: status || undefined,
      })
      .then((data) => active && setResult(data))
      .catch((cause) => active && setError(cause))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [page, search, status])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Missing persons"
        description="Create and manage the missing-person reports you submitted during an emergency."
        actions={
          <Button
            nativeButton={false}
            render={<Link href={routes.citizen.createMissingPerson} />}
          >
            <Plus /> New report
          </Button>
        }
      />
      <CollectionView
        surface="card"
        toolbar={
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_auto]">
            <Input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Search name or last seen location"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setPage(1)
                  setSearch(searchDraft.trim())
                }
              }}
            />
            <NativeSelect
              className="w-full"
              value={status}
              onChange={(event) => {
                setPage(1)
                setStatus(event.target.value as "" | MissingPersonStatus)
              }}
            >
              <NativeSelectOption value="">All statuses</NativeSelectOption>
              {(
                [
                  "reported",
                  "under_review",
                  "verified",
                  "searching",
                  "located",
                  "closed",
                  "rejected",
                ] as const
              ).map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {titleCase(value)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPage(1)
                setSearch(searchDraft.trim())
              }}
            >
              <Search /> Search
            </Button>
          </div>
        }
        isLoading={loading}
        loading={
          <div className="p-8 text-sm text-muted-foreground">
            Loading reports…
          </div>
        }
        hasError={Boolean(error)}
        error={
          <div className="p-5">
            <ApiFailure error={error} />
          </div>
        }
        isEmpty={!loading && !error && (result?.data.length ?? 0) === 0}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No reports found</EmptyTitle>
              <EmptyDescription>
                Create a missing-person report or change your filters.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                nativeButton={false}
                render={<Link href={routes.citizen.createMissingPerson} />}
              >
                Create report
              </Button>
            </EmptyContent>
          </Empty>
        }
        footer={
          result ? (
            <CollectionFooter
              summary={`${result.meta.total} total report${result.meta.total === 1 ? "" : "s"}`}
              pagination={
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={result.meta.current_page <= 1 || loading}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={
                      result.meta.current_page >= result.meta.last_page ||
                      loading
                    }
                    onClick={() => setPage((value) => value + 1)}
                  >
                    Next
                  </Button>
                </div>
              }
            />
          ) : undefined
        }
      >
        <CollectionList>
          {result?.data.map((item) => (
            <li key={item.id}>
              <Link
                href={routes.citizen.missingPerson(item.id)}
                className="block px-5 py-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-medium">{item.full_name}</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Last seen: {item.last_seen_location}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDateTime(item.last_seen_at)}
                    </p>
                  </div>
                  <EntityStatus tone={statusTone(item.status)}>
                    {titleCase(item.status)}
                  </EntityStatus>
                </div>
              </Link>
            </li>
          ))}
        </CollectionList>
      </CollectionView>
    </div>
  )
}
