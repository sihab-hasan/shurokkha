export interface ApiClientOptions {
  baseUrl: string
  defaultHeaders?: Record<string, string>
  credentials?: RequestCredentials
  onUnauthorized?: () => void
}

export function normalizeApiBaseUrl(baseUrl: string) {
  let normalized = baseUrl.trim()

  // Avoid regexes on externally supplied configuration values. Besides being
  // simpler, this keeps static-analysis tools from treating URL normalization
  // as a potentially expensive regular-expression sink.
  while (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1)
  }

  // The typed client owns API versioning (for example `/v1/auth/login`).
  // Accept the common local configuration variants without creating
  // accidental `/api/v1/v1/...` or missing-`/api` URLs.
  if (normalized.toLowerCase().endsWith("/api/v1")) {
    normalized = normalized.slice(0, -3)
  }

  if (!normalized.toLowerCase().endsWith("/api")) {
    normalized = `${normalized}/api`
  }

  return normalized
}

export interface ApiErrorPayload {
  message?: string
  errors?: Record<string, string[]>
  [key: string]: unknown
}

export class ApiError extends Error {
  status: number
  payload?: ApiErrorPayload

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.payload = payload
  }
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private credentials: RequestCredentials
  private onUnauthorized?: () => void

  constructor(options: ApiClientOptions) {
    this.baseUrl = normalizeApiBaseUrl(options.baseUrl)
    this.defaultHeaders = options.defaultHeaders || {
      Accept: "application/json",
    }
    this.credentials = options.credentials ?? "include"
    this.onUnauthorized = options.onUnauthorized
  }

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" })
  }

  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      headers: this.jsonHeaders(options?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(
    path: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      headers: this.jsonHeaders(options?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  async patch<T>(
    path: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      headers: this.jsonHeaders(options?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  async postForm<T>(
    path: string,
    body: FormData,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body,
    })
  }

  async patchForm<T>(
    path: string,
    body: FormData,
    options?: RequestInit
  ): Promise<T> {
    if (!body.has("_method")) body.append("_method", "PATCH")
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body,
    })
  }

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" })
  }

  async getBlob(path: string, options?: RequestInit): Promise<Blob> {
    const cleanPath = path.startsWith("/") ? path : `/${path}`
    const url = `${this.baseUrl}${cleanPath}`
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...this.headersToRecord(options?.headers),
    }

    const response = await fetch(url, {
      ...options,
      method: "GET",
      headers,
      credentials: options?.credentials ?? this.credentials,
    })

    if (!response.ok) {
      if (response.status === 401) this.onUnauthorized?.()
      throw await this.toApiError(response)
    }

    return response.blob()
  }

  private jsonHeaders(headers?: HeadersInit): Record<string, string> {
    return {
      "Content-Type": "application/json",
      ...this.headersToRecord(headers),
    }
  }

  private headersToRecord(headers?: HeadersInit): Record<string, string> {
    if (!headers) return {}
    return Object.fromEntries(new Headers(headers).entries())
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const cleanPath = path.startsWith("/") ? path : `/${path}`
    const url = `${this.baseUrl}${cleanPath}`

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...this.headersToRecord(options.headers),
    }

    const method = (options.method || "GET").toUpperCase()

    if (this.requiresCsrf(method)) {
      await this.ensureCsrfCookie()
      const xsrfToken = this.readBrowserCookie("XSRF-TOKEN")
      if (xsrfToken && !headers["X-XSRF-TOKEN"]) {
        headers["X-XSRF-TOKEN"] = xsrfToken
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: options.credentials ?? this.credentials,
    })

    if (!response.ok) {
      if (response.status === 401) this.onUnauthorized?.()
      throw await this.toApiError(response)
    }

    if (response.status === 204) return {} as T

    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      return response.json() as Promise<T>
    }

    return {} as T
  }
  private requiresCsrf(method: string) {
    return !["GET", "HEAD", "OPTIONS"].includes(method)
  }

  private readBrowserCookie(name: string): string | null {
    if (typeof document === "undefined") return null

    const prefix = `${name}=`
    const value = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(prefix))
      ?.slice(prefix.length)

    return value ? decodeURIComponent(value) : null
  }

  private async ensureCsrfCookie() {
    if (typeof document === "undefined") return
    if (this.readBrowserCookie("XSRF-TOKEN")) return

    const response = await fetch(`${this.baseUrl}/v1/auth/csrf`, {
      method: "GET",
      headers: this.defaultHeaders,
      credentials: this.credentials,
    })

    if (!response.ok) {
      throw await this.toApiError(response)
    }
  }

  private async toApiError(response: Response): Promise<ApiError> {
    let payload: ApiErrorPayload | undefined
    let errorMessage = `API Error: ${response.status} ${response.statusText}`

    try {
      payload = (await response.json()) as ApiErrorPayload
      if (payload?.message) {
        errorMessage = payload.message
      } else if (payload?.errors) {
        const firstError = Object.values(payload.errors)[0]?.[0]
        if (firstError) errorMessage = firstError
      }
    } catch {
      // Non-JSON error response.
    }

    return new ApiError(response.status, errorMessage, payload)
  }
}

export function createApiClient(options: ApiClientOptions) {
  return new ApiClient(options)
}