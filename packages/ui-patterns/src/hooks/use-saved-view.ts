"use client"

import * as React from "react"
import type { SavedView } from "../filters/filter.types"

export function useSavedView(views: SavedView[], initialViewId?: string) {
  const fallback =
    initialViewId ??
    views.find((view) => view.isDefault)?.id ??
    views[0]?.id ??
    null
  const [selectedViewId, setSelectedViewId] = React.useState<string | null>(
    fallback
  )

  React.useEffect(() => {
    if (selectedViewId && views.some((view) => view.id === selectedViewId))
      return
    // Fall back when the selected view is removed from the supplied view list.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedViewId(
      views.find((view) => view.isDefault)?.id ?? views[0]?.id ?? null
    )
  }, [selectedViewId, views])

  return {
    selectedViewId,
    selectedView: views.find((view) => view.id === selectedViewId) ?? null,
    setSelectedViewId,
  }
}
