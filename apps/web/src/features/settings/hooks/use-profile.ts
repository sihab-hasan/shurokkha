"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Profile, ProfileInput } from "@shurokkha/contracts"

import { toast } from "@shurokkha/ui/components/sonner"

import {
  destroyAvatar,
  fetchProfile,
  updateProfile,
  uploadAvatar,
} from "../api"
import { errorMessage } from "@/features/shared/api-feedback"

export const profileQueryKey = ["settings", "profile"] as const

export function useProfile() {
  return useQuery<Profile>({
    queryKey: [...profileQueryKey],
    queryFn: fetchProfile,
    staleTime: 30_000,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation<Profile, Error, ProfileInput>({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData([...profileQueryKey], profile)
      // Refresh the header's `/me` payload so the avatar/email in the
      // account menu reflect the change immediately.
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      toast.success("Profile updated.")
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not update profile."))
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation<Profile, Error, File>({
    mutationFn: uploadAvatar,
    onSuccess: (profile) => {
      queryClient.setQueryData([...profileQueryKey], profile)
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      toast.success("Avatar updated.")
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not upload avatar."))
    },
  })
}

export function useDestroyAvatar() {
  const queryClient = useQueryClient()

  return useMutation<Profile, Error, void>({
    mutationFn: destroyAvatar,
    onSuccess: (profile) => {
      queryClient.setQueryData([...profileQueryKey], profile)
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      toast.success("Avatar removed.")
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not remove avatar."))
    },
  })
}
