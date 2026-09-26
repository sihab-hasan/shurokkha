"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { disableTwoFactor, enableTwoFactor } from "../api"
import { profileQueryKey } from "./use-profile"

export function useEnableTwoFactor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: enableTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...profileQueryKey] })
    },
  })
}

export function useDisableTwoFactor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: disableTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...profileQueryKey] })
    },
  })
}
