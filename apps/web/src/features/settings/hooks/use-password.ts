"use client"

import { useMutation } from "@tanstack/react-query"

import { updatePassword } from "../api"

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updatePassword,
  })
}
