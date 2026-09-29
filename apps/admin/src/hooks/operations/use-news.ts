"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@shurokkha/ui/components/sonner"

import type { NewsInput } from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type { NewsAdminRecord } from "./types"

export function useNews() {
  const queryClient = useQueryClient()
  const api = getShurokkhaApi()

  const query = useQuery({
    queryKey: operationsQueryKeys.news.list(),
    queryFn: async () => {
      const res = await api.admin.news.list()
      return (res.data ?? []) as unknown as NewsAdminRecord[]
    },
  })

  const create = useMutation({
    mutationFn: async (payload: NewsInput) => api.admin.news.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.news.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("News article published!")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create news article.")
    },
  })

  const update = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: Partial<NewsInput>
    }) => api.admin.news.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.news.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("News article updated.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update news article.")
    },
  })

  const remove = useMutation({
    mutationFn: async (id: number) => api.admin.news.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: operationsQueryKeys.news.all(),
      })
      queryClient.invalidateQueries({ queryKey: ["public"] })
      toast.success("News article deleted.")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete news article.")
    },
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    create,
    update,
    remove,
  }
}

export function useNewsArticle(articleId: number | undefined) {
  const { data, isLoading, update, remove } = useNews()
  const article =
    articleId == null
      ? undefined
      : data.find((row) => row.news_id === articleId)
  return { article, isLoading, update, remove }
}
