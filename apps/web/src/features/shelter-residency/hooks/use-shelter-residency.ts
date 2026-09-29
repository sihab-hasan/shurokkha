"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import { getShurokkhaApi } from "@/lib/api"

import type { ShelterResidencyInput } from "@shurokkha/contracts"

export function useMyShelterResidency() {
  return useQuery({
    queryKey: ["account", "shelter-residency"],
    queryFn: async () => {
      const res = await getShurokkhaApi().account.shelterResidency.show()
      return res.data ?? null
    },
  })
}

export function useShelterResidencyMutations() {
  const queryClient = useQueryClient()
  const checkIn = useMutation({
    mutationFn: async (input: ShelterResidencyInput) =>
      getShurokkhaApi().account.shelterResidency.checkIn(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account", "shelter-residency"],
      })
      toast.success("Checked in.")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to check in."),
  })
  const checkOut = useMutation({
    mutationFn: async () =>
      getShurokkhaApi().account.shelterResidency.checkOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account", "shelter-residency"],
      })
      toast.success("Checked out.")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to check out."),
  })
  return { checkIn, checkOut }
}
