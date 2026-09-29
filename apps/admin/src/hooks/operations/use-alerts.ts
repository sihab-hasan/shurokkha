"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type { AlertInput } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { AlertAdminRecord } from "./types"

export function useAlerts() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.alerts.list(),
    queryFn: async () => {
      const res = await api.admin.alerts.list()
      return (res.data ?? []) as unknown as AlertAdminRecord[]
    },
  })

  const create = useMutation({
    mutationFn: async (payload: AlertInput) => api.admin.alerts.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.alerts.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Alert published successfully!")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create alert.")
    },
  })

  const update = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: Partial<AlertInput>
    }) => api.admin.alerts.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.alerts.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Alert updated.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update alert.")
    },
  })

  const remove = useMutation({
    mutationFn: async (id: number) => api.admin.alerts.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.alerts.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("Alert deleted.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete alert.")
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

export function useAlert(alertId: number | undefined) {
  const { data, isLoading, update, remove } = useAlerts()
  const alert =
    alertId == null ? undefined : data.find((row) => row.alert_id === alertId)
  return { alert, isLoading, update, remove }
}
