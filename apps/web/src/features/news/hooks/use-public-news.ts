"use client"

import { useQuery } from "@tanstack/react-query"

import { getShurokkhaApi } from "@/lib/api"

import type { PublicNewsListParams } from "@shurokkha/contracts"

/**
 * Public news listing — uses `getShurokkhaApi().public.news.list()`.
 * No auth required.
 */
export function usePublicNews(params: PublicNewsListParams = {}) {
  return useQuery({
    queryKey: ["public", "news", params],
    queryFn: async () => {
      const res = await getShurokkhaApi().public.news.list(params)
      return res
    },
  })
}

/**
 * Single news article by slug. Disabled until a slug is provided.
 */
export function usePublicNewsArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ["public", "news", "article", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const res = await getShurokkhaApi().public.news.get(slug as string)
      return res
    },
  })
}
