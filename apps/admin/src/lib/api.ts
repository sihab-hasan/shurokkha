import { createShurokkhaApi, normalizeApiBaseUrl } from "@shurokkha/api-client"

const DEFAULT_API_ORIGIN = "http://localhost:8000"
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"])
const unauthorizedListeners = new Set<() => void>()

function alignLocalApiHostname(value: string) {
  if (typeof window === "undefined") return value

  try {
    const apiUrl = new URL(value)
    const browserHost = window.location.hostname

    if (
      LOOPBACK_HOSTS.has(apiUrl.hostname) &&
      LOOPBACK_HOSTS.has(browserHost)
    ) {
      apiUrl.hostname = browserHost
      return apiUrl.toString()
    }
  } catch {
    // normalizeApiBaseUrl will report malformed URLs when a request is made.
  }

  return value
}

function notifyUnauthorized() {
  unauthorizedListeners.forEach((listener) => listener())
}

export function subscribeToUnauthorized(listener: () => void) {
  unauthorizedListeners.add(listener)
  return () => {
    unauthorizedListeners.delete(listener)
  }
}

export function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_ORIGIN
  return normalizeApiBaseUrl(alignLocalApiHostname(configured))
}

export function getShurokkhaApi() {
  return createShurokkhaApi({
    baseUrl: getApiBaseUrl(),
    onUnauthorized: notifyUnauthorized,
  })
}
