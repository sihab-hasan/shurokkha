"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  NotificationPreferences,
  NotificationPreferencesInput,
} from "@shurokkha/contracts"

import { toast } from "@shurokkha/ui/components/sonner"

import { fetchNotificationPrefs, updateNotificationPrefs } from "../api"
import { errorMessage } from "@/features/shared/api-feedback"

export const notificationPrefsQueryKey = [
  "settings",
  "notification-preferences",
] as const

export function useNotificationPrefs() {
  return useQuery<NotificationPreferences>({
    queryKey: [...notificationPrefsQueryKey],
    queryFn: fetchNotificationPrefs,
    staleTime: 30_000,
  })
}

export function useUpdateNotificationPrefs() {
  const queryClient = useQueryClient()

  return useMutation<
    NotificationPreferences,
    Error,
    NotificationPreferencesInput
  >({
    mutationFn: updateNotificationPrefs,
    onSuccess: (prefs) => {
      queryClient.setQueryData([...notificationPrefsQueryKey], prefs)
      toast.success("Notification preferences saved.")
    },
    onError: (error) => {
      toast.error(
        errorMessage(error, "Could not save notification preferences.")
      )
    },
  })
}
