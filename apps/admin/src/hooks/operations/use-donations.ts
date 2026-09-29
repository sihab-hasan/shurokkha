"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type { DonationInput, DonationStats } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { DonationAdminRecord } from "./types"

export function useDonations() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.donations.list(),
    queryFn: async () => {
      const res = await api.admin.donations.list()
      return (res.data ?? []) as unknown as DonationAdminRecord[]
    },
  })

  const statsQuery = useQuery({
    queryKey: [...operationsQueryKeys.donations.all(), "stats"],
    queryFn: async () => {
      const res = await api.admin.donations.stats()
      return (res.data ?? null) as DonationStats | null
    },
  })

  const create = useMutation({
    mutationFn: async (input: DonationInput) =>
      api.admin.donations.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.donations.all(),
      })
      toast.success("Donation recorded.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to record donation."),
  })

  const remove = useMutation({
    mutationFn: async (id: number) => api.admin.donations.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.donations.all(),
      })
      toast.success("Donation deleted.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to delete donation."),
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    stats: statsQuery.data,
    statsLoading: statsQuery.isLoading,
    create,
    remove,
  }
}
