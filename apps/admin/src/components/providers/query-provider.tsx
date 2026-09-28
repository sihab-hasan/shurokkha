"use client"

import { useState, type ReactNode } from "react"

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

/**
 * Single QueryClient per browser tab, fresh on every server render.
 * Follows the recommended Next.js App Router pattern: avoids sharing
 * state across requests on the server while still deduping in the browser.
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserClient: QueryClient | undefined

function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient()
  if (!browserClient) browserClient = makeQueryClient()
  return browserClient
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // useState ensures the client survives re-renders but is created only once.
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      ) : null}
    </QueryClientProvider>
  )
}
