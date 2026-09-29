"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type { GuideInput } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { GuideAdminRecord } from "./types"

export function useGuides() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.guides.list(),
    queryFn: async () => {
      const res = await api.admin.guides.list()
      return (res.data ?? []) as unknown as GuideAdminRecord[]
    },
  })

  const create = useMutation({
    mutationFn: async (payload: GuideInput) => api.admin.guides.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.guides.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Guide published!")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create guide.")
    },
  })

  const update = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: Partial<GuideInput>
    }) => api.admin.guides.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.guides.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Guide updated.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update guide.")
    },
  })

  const remove = useMutation({
    mutationFn: async (id: number) => api.admin.guides.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.guides.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Guide deleted.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete guide.")
    },
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    create,
    update,
    remove,
  }
}

export function useGuide(guideId: number | undefined) {
  const { data, isLoading, update, remove } = useGuides()
  const guide =
    guideId == null ? undefined : data.find((row) => row.guide_id === guideId)
  return { guide, isLoading, update, remove }
}
