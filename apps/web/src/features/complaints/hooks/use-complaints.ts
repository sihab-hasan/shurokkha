"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import { getShurokkhaApi } from "@/lib/api"

import type { ComplaintInput } from "@shurokkha/contracts"

export function useMyComplaints() {
  return useQuery({
    queryKey: ["account", "complaints"],
    queryFn: async () => {
      const res = await getShurokkhaApi().account.complaints.list()
      return res.data ?? []
    },
  })
}

export function useComplaintMutations() {
  const queryClient = useQueryClient()
  const submit = useMutation({
    mutationFn: async (input: ComplaintInput) =>
      getShurokkhaApi().account.complaints.submit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "complaints"] })
      toast.success("Complaint submitted.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to submit complaint."),
  })
  return { submit }
}
