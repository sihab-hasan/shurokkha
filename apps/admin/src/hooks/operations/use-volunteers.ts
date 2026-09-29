"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type { VolunteerReviewInput as ContractReviewInput } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { VolunteerAdminRecord } from "./types"

export type VolunteerReviewInput = ContractReviewInput

export function useVolunteers() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.volunteers.list(),
    queryFn: async () => {
      const res = await api.admin.volunteers.list()
      return (res.data ?? []) as unknown as VolunteerAdminRecord[]
    },
  })

  const review = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: VolunteerReviewInput
    }) => api.admin.volunteers.review(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.volunteers.all(),
      })
      toast.success("Volunteer application reviewed.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to review volunteer.")
    },
  })

  const remove = useMutation({
    mutationFn: async (id: number) => api.admin.volunteers.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.volunteers.all(),
      })
      toast.success("Volunteer application deleted.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete volunteer.")
    },
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    review,
    remove,
  }
}

export function useVolunteer(volunteerId: number | undefined) {
  const { data, isLoading, review, remove } = useVolunteers()
  const volunteer =
    volunteerId == null
      ? undefined
      : data.find((row) => row.volunteer_id === volunteerId)
  return { volunteer, isLoading, review, remove }
}
