"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { AffectedAreaAdminRecord, AffectedAreaSeverity } from "./types"

export interface CreateAffectedAreaInput {
  disaster_id: number
  location_id?: number
  affected_population: number
  severity: AffectedAreaSeverity
}

export function useAffectedAreas() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.affectedAreas.list(),
    queryFn: async () => {
      const res = await api.admin.affectedAreas.list()
      return (res.data ?? []) as unknown as AffectedAreaAdminRecord[]
    },
  })

  const create = useMutation({
    mutationFn: async (payload: CreateAffectedAreaInput) =>
      api.admin.affectedAreas.create({
        disaster_id: payload.disaster_id,
        location_id: payload.location_id ?? 101,
        affected_population: payload.affected_population,
        severity: payload.severity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.affectedAreas.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Affected Area added successfully!")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create affected area.")
    },
  })

  const remove = useMutation({
    mutationFn: async (areaId: number) =>
      api.admin.affectedAreas.remove(areaId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.affectedAreas.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Affected Area deleted.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete affected area.")
    },
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    create,
    remove,
  }
}

/**
 * Look up a single affected-area record plus its loading + delete state.
 * Used by detail pages; returns a stable reference when `areaId` is undefined.
 */
export function useAffectedArea(areaId: number | undefined) {
  const { data, isLoading, remove } = useAffectedAreas()
  const area =
    areaId == null ? undefined : data.find((row) => row.area_id === areaId)
  return { area, isLoading, remove }
}
