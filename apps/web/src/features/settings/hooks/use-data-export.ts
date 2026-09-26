"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fetchDataExportRequest, requestDataExport } from "../api"

export const dataExportQueryKey = ["settings", "data-export"] as const

export function useDataExportRequest() {
  return useQuery({
    queryKey: [...dataExportQueryKey],
    queryFn: fetchDataExportRequest,
    staleTime: 30_000,
  })
}

export function useRequestDataExport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: requestDataExport,
    onSuccess: (data) => {
      queryClient.setQueryData([...dataExportQueryKey], data)
    },
  })
}
