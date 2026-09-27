"use client"

import { useQuery } from "@tanstack/react-query"

import { getShurokkhaApi } from "@/lib/api"

/**
 * Fetch the public profile for `/u/{username}`. 404s surface as a normal
 * `error` (the consuming page renders `notFound()`).
 */
export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ["public", "profile", username],
    queryFn: async () => {
      const response = await getShurokkhaApi().public.profiles.get(username)
      return response
    },
    enabled: username.length > 0,
    retry: false,
  })
}
