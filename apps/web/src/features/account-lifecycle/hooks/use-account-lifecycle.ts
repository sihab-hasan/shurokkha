"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import { getShurokkhaApi } from "@/lib/api"

import type { AppealInput, FeedbackInput } from "@shurokkha/contracts"

// Feedback
export function useMyFeedback() {
  return useQuery({
    queryKey: ["account", "feedback"],
    queryFn: async () => {
      const res = await getShurokkhaApi().account.feedback.list()
      return res.data ?? []
    },
  })
}

export function useFeedbackMutations() {
  const qc = useQueryClient()
  const submit = useMutation({
    mutationFn: async (input: FeedbackInput) =>
      getShurokkhaApi().account.feedback.submit(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["account", "feedback"] })
      toast.success("Feedback submitted.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to submit feedback."),
  })
  return { submit }
}

// Appeals
export function useMyAppeals() {
  return useQuery({
    queryKey: ["account", "appeals"],
    queryFn: async () => {
      const res = await getShurokkhaApi().account.appeals.list()
      return res.data ?? []
    },
  })
}

export function useAppealMutations() {
  const qc = useQueryClient()
  const submit = useMutation({
    mutationFn: async (input: AppealInput) =>
      getShurokkhaApi().account.appeals.submit(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["account", "appeals"] })
      toast.success("Appeal submitted.")
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to submit appeal."),
  })
  return { submit }
}

// Documents
export function useMyDocuments() {
  return useQuery({
    queryKey: ["account", "documents"],
    queryFn: async () => {
      const res = await getShurokkhaApi().account.documents.list()
      return res.data ?? []
    },
  })
}

export function useDocumentMutations() {
  const qc = useQueryClient()
  const upload = useMutation({
    mutationFn: async (
      input: Parameters<
        ReturnType<typeof getShurokkhaApi>["account"]["documents"]["upload"]
      >[0]
    ) => getShurokkhaApi().account.documents.upload(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["account", "documents"] })
      toast.success("Document uploaded.")
    },
    onError: (err: Error) => toast.error(err.message || "Upload failed."),
  })
  const remove = useMutation({
    mutationFn: async (id: number) =>
      getShurokkhaApi().account.documents.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["account", "documents"] })
      toast.success("Document deleted.")
    },
    onError: (err: Error) => toast.error(err.message || "Delete failed."),
  })
  return { upload, remove }
}
