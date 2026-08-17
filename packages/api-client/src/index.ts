export interface ApiClientOptions {
  baseUrl: string
  defaultHeaders?: Record<string, string>
  getToken?: () => string | null | undefined
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
  private getToken?: () => string | null | undefined

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "")
    this.defaultHeaders = options.defaultHeaders || {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
    this.getToken = options.getToken
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
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" })
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const cleanPath = path.startsWith("/") ? path : `/${path}`
    const url = `${this.baseUrl}${cleanPath}`

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...((options.headers as Record<string, string>) || {}),
    }

    const token = this.getToken
      ? this.getToken()
      : typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : null
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers,
    })

    if (!response.ok) {
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
        // Response wasn't JSON
      }

      throw new ApiError(response.status, errorMessage, payload)
    }

    // Return empty object or text if no json
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>
    }

    return {} as T
  }
}

export function createApiClient(options: ApiClientOptions) {
  return new ApiClient(options)
}
