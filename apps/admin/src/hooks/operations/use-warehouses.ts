"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type { WarehouseInput } from "@shurokkha/contracts"
import type { AdminWarehouseDistributeInput } from "@shurokkha/api-client/admin"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { WarehouseAdminRecord } from "./types"

export function useWarehouses() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.warehouses.list(),
    queryFn: async () => {
      const res = await api.admin.warehouses.list()
      return (res.data ?? []) as unknown as WarehouseAdminRecord[]
    },
  })

  const create = useMutation({
    mutationFn: async (input: WarehouseInput) =>
      api.admin.warehouses.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.warehouses.all(),
      })
      toast.success("Warehouse created!")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to create warehouse."),
  })

  const distribute = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: AdminWarehouseDistributeInput
    }) => api.admin.warehouses.distribute(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.warehouses.all(),
      })
      toast.success("Relief supplies distributed.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to distribute relief supplies."),
  })

  const remove = useMutation({
    mutationFn: async (id: number) => api.admin.warehouses.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.warehouses.all(),
      })
      toast.success("Warehouse deleted.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to delete warehouse."),
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    create,
    distribute,
    remove,
  }
}
