"use client"

import { useRef } from "react"

import { useVirtualizer } from "@tanstack/react-virtual"

const DEFAULT_OVERSCAN = 5
const DEFAULT_ESTIMATE_SIZE = 64

/**
 * Tiny adapter over `@tanstack/react-virtual` that:
 *   1. Owns the scroll container ref.
 *   2. Returns the virtualizer plus helpers the caller uses to render a
 *      window of items, a sizing spacer, and a translateY offset per item.
 *   3. Auto-skips virtualization when the list is short — there is no
 *      perf benefit at small sizes and the wrapper overhead costs more
 *      than it saves.
 *
 * @param count number of items in the list
 * @param options.estimateSize row height (px); defaults to 64
 * @param options.overScan rows to render above/below the visible window
 */
export function useListVirtualizer(
  count: number,
  options: { estimateSize?: number; overScan?: number } = {}
) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => options.estimateSize ?? DEFAULT_ESTIMATE_SIZE,
    overscan: options.overScan ?? DEFAULT_OVERSCAN,
  })

  const shouldVirtualize = count >= 50

  return { parentRef, virtualizer, shouldVirtualize }
}
