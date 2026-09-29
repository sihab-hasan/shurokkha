"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type { FundraiseInput } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { FundraiseAdminRecord } from "./types"

export function useFundraises() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.fundraises.list(),
    queryFn: async () => {
      const res = await api.admin.fundraises.list()
      return (res.data ?? []) as unknown as FundraiseAdminRecord[]
    },
  })

  const create = useMutation({
    mutationFn: async (payload: FundraiseInput) =>
      api.admin.fundraises.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.fundraises.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Fundraise campaign created!")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create fundraise.")
    },
  })

  const update = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: Partial<FundraiseInput>
    }) => api.admin.fundraises.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.fundraises.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Fundraise updated.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update fundraise.")
    },
  })

  const remove = useMutation({
    mutationFn: async (id: number) => api.admin.fundraises.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.fundraises.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Fundraise deleted.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete fundraise.")
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

export function useFundraise(fundraiseId: number | undefined) {
  const { data, isLoading, update, remove } = useFundraises()
  const fundraise =
    fundraiseId == null
      ? undefined
      : data.find((row) => row.fundraise_id === fundraiseId)
  return { fundraise, isLoading, update, remove }
}
