"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { getShurokkhaApi } from "@/lib/api"

interface MissingPersonPhotoProps {
  id: string
  name: string
  hasPhoto: boolean
}

export function MissingPersonPhoto({
  id,
  name,
  hasPhoto,
}: MissingPersonPhotoProps) {
  const [src, setSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!hasPhoto) return

    let active = true
    let objectUrl: string | null = null

    getShurokkhaApi()
      .citizen.missingPersons.photo(id)
      .then((blob) => {
        if (!active) return
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      })
      .catch(() => {
        if (active) setFailed(true)
      })

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [hasPhoto, id])

  if (!hasPhoto) return null

  if (failed) {
    return (
      <div className="mb-6 rounded-xl border bg-muted/50 p-6 text-sm text-muted-foreground">
        The attached photo could not be loaded.
      </div>
    )
  }

  if (!src) {
    return (
      <div className="mb-6 flex min-h-48 items-center justify-center rounded-xl border bg-muted/50 text-sm text-muted-foreground">
        Loading protected photo…
      </div>
    )
  }

  return (
    <div className="mb-6 overflow-hidden rounded-xl border bg-muted">
      <Image
        src={src}
        alt={`Recent photo of ${name}`}
        width={900}
        height={600}
        unoptimized
        className="max-h-96 w-full object-contain"
      />
    </div>
  )
}
