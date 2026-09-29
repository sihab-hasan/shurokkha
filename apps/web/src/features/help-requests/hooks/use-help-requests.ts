"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import { getShurokkhaApi } from "@/lib/api"

import type { HelpRequestInput } from "@shurokkha/contracts"

export function useMyHelpRequests() {
  return useQuery({
    queryKey: ["account", "help-requests"],
    queryFn: async () => {
      const res = await getShurokkhaApi().account.helpRequests.list()
      return res.data ?? []
    },
  })
}

export function useHelpRequestMutations() {
  const queryClient = useQueryClient()
  const submit = useMutation({
    mutationFn: async (input: HelpRequestInput) =>
      getShurokkhaApi().account.helpRequests.submit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "help-requests"] })
      toast.success("Help request submitted.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to submit request."),
  })
  return { submit }
}
