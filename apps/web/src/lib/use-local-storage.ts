"use client"

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"

/**
 * SSR-safe `useState` that hydrates from `localStorage` after mount.
 *
 * - Server / first client render returns `initialValue` (no hydration mismatch).
 * - After `useEffect`, the hook reads the actual stored value and swaps.
 * - Writes go through `setStoredValue`, which persists to `localStorage`
 *   and broadcasts a `storage` event so other tabs/hooks stay in sync.
 *
 * Pass a JSON-serialisable default — anything else (Date, Map, …) needs
 * a custom `serializer`/`deserializer`.
 */
export function useLocalStorage<
  T extends string | number | boolean | object | null,
>(
  key: string,
  initialValue: T,
  options?: {
    serializer?: (value: T) => string
    deserializer?: (raw: string) => T
  }
): [T, Dispatch<SetStateAction<T>>] {
  const serializer = options?.serializer ?? JSON.stringify
  const deserializer =
    options?.deserializer ?? ((raw: string) => JSON.parse(raw) as T)

  const [value, setValue] = useState<T>(initialValue)
  const initialized = useRef(false)

  // Hydrate from localStorage on mount.
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) setValue(deserializer(raw))
    } catch {
      // Ignore parse errors — fall back to initialValue.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track the last value WE serialized so we can skip broadcasting when
  // we're reacting to a same-tab event from another consumer (otherwise
  // we'd ping-pong: writer → event → listener → effect → event → …).
  const lastSerializedRef = useRef<string | null>(null)

  // Persist on update AND broadcast same-tab so other consumers of the
  // same key re-read the new value. Without this, a `<TablePrefsMenu>`
  // and the list that consumes its state are rendered as sibling
  // components in the same tab — their `useState` snapshots diverge
  // even though both read the same `localStorage` key.
  useEffect(() => {
    if (!initialized.current) return
    if (typeof window === "undefined") return
    let serialized: string
    try {
      serialized = serializer(value)
    } catch {
      // Can't serialize — silently degrade.
      return
    }
    if (serialized === lastSerializedRef.current) {
      // This update came from our own listener; don't echo it back.
      lastSerializedRef.current = null
      return
    }
    try {
      window.localStorage.setItem(key, serialized)
      window.dispatchEvent(
        new CustomEvent("local-storage", { detail: { key, value: serialized } })
      )
    } catch {
      // Quota exceeded or storage disabled — silently degrade.
    }
  }, [key, serializer, value])

  // Cross-tab + same-tab sync.
  useEffect(() => {
    if (typeof window === "undefined") return
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key || event.newValue === null) return
      // Mark this serialized payload as one we observed, so our persist
      // effect doesn't broadcast it back to the other tab.
      lastSerializedRef.current = event.newValue
      try {
        setValue(deserializer(event.newValue))
      } catch {
        // ignore
      }
    }
    const onLocal = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string; value: string }>)
        .detail
      if (!detail || detail.key !== key) return
      // Mark this serialized payload as one we observed, so the persist
      // effect doesn't broadcast it back.
      lastSerializedRef.current = detail.value
      try {
        setValue(deserializer(detail.value))
      } catch {
        // ignore
      }
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener("local-storage", onLocal as EventListener)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("local-storage", onLocal as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [value, setValue]
}
