"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  PrivacyPreferences,
  PrivacyPreferencesInput,
} from "@shurokkha/contracts"

import { toast } from "@shurokkha/ui/components/sonner"

import { fetchPrivacyPrefs, updatePrivacyPrefs } from "../api"
import { errorMessage } from "@/features/shared/api-feedback"

export const privacyPrefsQueryKey = ["settings", "privacy-preferences"] as const

export function usePrivacyPrefs() {
  return useQuery<PrivacyPreferences>({
    queryKey: [...privacyPrefsQueryKey],
    queryFn: fetchPrivacyPrefs,
    staleTime: 30_000,
  })
}

export function useUpdatePrivacyPrefs() {
  const queryClient = useQueryClient()

  return useMutation<PrivacyPreferences, Error, PrivacyPreferencesInput>({
    mutationFn: updatePrivacyPrefs,
    onSuccess: (prefs) => {
      queryClient.setQueryData([...privacyPrefsQueryKey], prefs)
      toast.success("Privacy preferences saved.")
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not save privacy preferences."))
    },
  })
}
