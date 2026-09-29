"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type {
  AdminAssignRoleInput,
  AdminUserInput,
  AdminUserListParams,
  AdminUserUpdateInput,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { UserAdminRecord } from "./types"

export function useUsers(params: AdminUserListParams = {}) {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.users.list(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await api.admin.users.list(params)
      return (res.data ?? []) as unknown as UserAdminRecord[]
    },
  })

  const create = useMutation({
    mutationFn: async (input: AdminUserInput) => api.admin.users.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.users.all(),
      })
      toast.success("User created!")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to create user."),
  })

  const update = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: AdminUserUpdateInput
    }) => api.admin.users.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.users.all(),
      })
      toast.success("User updated.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to update user."),
  })

  const remove = useMutation({
    mutationFn: async (id: number) => api.admin.users.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.users.all(),
      })
      toast.success("User deleted.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to delete user."),
  })

  const restore = useMutation({
    mutationFn: async (id: number) => api.admin.users.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.users.all(),
      })
      toast.success("User restored.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to restore user."),
  })

  const assignRole = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: AdminAssignRoleInput
    }) => api.admin.users.assignRole(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.users.all(),
      })
      toast.success("Role updated.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to assign role."),
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    create,
    update,
    remove,
    restore,
    assignRole,
  }
}

export function useUser(userId: number | undefined) {
  const { data, isLoading, update, remove, restore, assignRole } = useUsers()
  const user =
    userId == null ? undefined : data.find((row) => row.id === userId)
  return { user, isLoading, update, remove, restore, assignRole }
}
