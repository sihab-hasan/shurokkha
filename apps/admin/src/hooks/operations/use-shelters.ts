"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type {
  ShelterInput,
  ShelterOccupancyInput,
  ShelterStatus,
  ShelterUpdateInput,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { ShelterAdminRecord } from "./types"

export function useShelters() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.shelters.list(),
    queryFn: async () => {
      const res = await api.admin.shelters.list()
      return (res.data ?? []) as unknown as ShelterAdminRecord[]
    },
  })

  const create = useMutation({
    mutationFn: async (input: ShelterInput) => api.admin.shelters.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.shelters.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Shelter created!")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to create shelter."),
  })

  const update = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: ShelterUpdateInput
    }) => api.admin.shelters.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.shelters.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Shelter updated.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to update shelter."),
  })

  const updateOccupancy = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: ShelterOccupancyInput
    }) => api.admin.shelters.updateOccupancy(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.shelters.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Occupancy updated.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to update occupancy."),
  })

  const remove = useMutation({
    mutationFn: async (id: number) => api.admin.shelters.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.shelters.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Shelter deleted.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to delete shelter."),
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    create,
    update,
    updateOccupancy,
    remove,
  }
}

export function useShelter(shelterId: number | undefined) {
  const { data, isLoading, update, updateOccupancy, remove } = useShelters()
  const shelter =
    shelterId == null
      ? undefined
      : data.find((row) => row.shelter_id === shelterId)
  return { shelter, isLoading, update, updateOccupancy, remove }
}

export type { ShelterStatus }
