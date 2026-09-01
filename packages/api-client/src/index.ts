import type {
  ApiResource,
  ApiUser,
  AssistanceRequestInput,
  AssistanceRequestListParams,
  AssistanceRequestRecord,
  AuthResponse,
  MissingPersonListParams,
  MissingPersonReportInput,
  MissingPersonReportRecord,
  PaginatedResource,
  DisasterRecord,
  AffectedAreaRecord,
  AffectedAreaInput,
  RescueTeamRecord,
  RescueTeamInput,
  TeamAssignmentRecord,
  TeamAssignmentInput,
  ShelterRecord,
  ShelterInput,
  WarehouseRecord,
  WarehouseInput,
  DonationRecord,
  DonationInput,
} from "@shurokkha/contracts"

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

function queryString(params: object) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(
    params as Record<string, string | number | undefined>
  )) {
    if (value !== undefined && value !== "") search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ""
}

function appendFormValue(
  form: FormData,
  key: string,
  value: string | number | null | undefined,
  includeNull = false
) {
  if (value === undefined) return
  if (value === null || value === "") {
    if (includeNull) form.append(key, "")
    return
  }
  form.append(key, String(value))
}

function missingPersonFormData(
  input: MissingPersonReportInput,
  options: {
    photo?: File | null
    includeNulls?: boolean
    removePhoto?: boolean
  } = {}
) {
  const form = new FormData()
  const includeNulls = options.includeNulls ?? false

  appendFormValue(form, "full_name", input.full_name)
  appendFormValue(form, "age", input.age, includeNulls)
  appendFormValue(form, "gender", input.gender, includeNulls)
  appendFormValue(
    form,
    "physical_description",
    input.physical_description,
    includeNulls
  )
  appendFormValue(
    form,
    "distinguishing_features",
    input.distinguishing_features,
    includeNulls
  )
  appendFormValue(form, "last_seen_at", input.last_seen_at)
  appendFormValue(form, "last_seen_location", input.last_seen_location)
  appendFormValue(form, "latitude", input.latitude, includeNulls)
  appendFormValue(form, "longitude", input.longitude, includeNulls)
  appendFormValue(form, "contact_phone", input.contact_phone)

  if (options.photo) form.append("photo", options.photo)
  if (options.removePhoto) form.append("remove_photo", "1")

  return form
}

export function createApiClient(options: ApiClientOptions) {
  return new ApiClient(options)
}

export function createShurokkhaApi(options: ApiClientOptions) {
  const client = createApiClient(options)

  return {
    system: {
      health: () =>
        client.get<{ status: string; service: string; version: string }>(
          "/v1/health"
        ),
    },
    auth: {
      csrf: () => client.get<{ csrf: string }>("/v1/auth/csrf"),
      register: async (input: {
        name: string
        email: string
        password: string
      }) => {
        await client.get<{ csrf: string }>("/v1/auth/csrf")
        return client.post<AuthResponse>("/v1/auth/register", input)
      },
      login: async (input: {
        email: string
        password: string
        remember?: boolean
      }) => {
        await client.get<{ csrf: string }>("/v1/auth/csrf")
        return client.post<AuthResponse>("/v1/auth/login", input)
      },
      me: () => client.get<ApiResource<ApiUser>>("/v1/auth/me"),
      logout: () => client.post<void>("/v1/auth/logout"),
    },
    citizen: {
      assistanceRequests: {
        list: (params: AssistanceRequestListParams = {}) =>
          client.get<PaginatedResource<AssistanceRequestRecord>>(
            `/v1/citizen/requests${queryString(params)}`
          ),
        get: (id: string) =>
          client.get<ApiResource<AssistanceRequestRecord>>(
            `/v1/citizen/requests/${id}`
          ),
        create: (input: AssistanceRequestInput) =>
          client.post<ApiResource<AssistanceRequestRecord>>(
            "/v1/citizen/requests",
            input
          ),
        update: (id: string, input: Partial<AssistanceRequestInput>) =>
          client.patch<ApiResource<AssistanceRequestRecord>>(
            `/v1/citizen/requests/${id}`,
            input
          ),
        cancel: (id: string) =>
          client.post<ApiResource<AssistanceRequestRecord>>(
            `/v1/citizen/requests/${id}/cancel`
          ),
        remove: (id: string) =>
          client.delete<void>(`/v1/citizen/requests/${id}`),
      },
      missingPersons: {
        list: (params: MissingPersonListParams = {}) =>
          client.get<PaginatedResource<MissingPersonReportRecord>>(
            `/v1/citizen/missing-persons${queryString(params)}`
          ),
        get: (id: string) =>
          client.get<ApiResource<MissingPersonReportRecord>>(
            `/v1/citizen/missing-persons/${id}`
          ),
        create: (input: MissingPersonReportInput, photo?: File | null) =>
          client.postForm<ApiResource<MissingPersonReportRecord>>(
            "/v1/citizen/missing-persons",
            missingPersonFormData(input, { photo })
          ),
        update: (
          id: string,
          input: MissingPersonReportInput,
          options: { photo?: File | null; removePhoto?: boolean } = {}
        ) =>
          client.patchForm<ApiResource<MissingPersonReportRecord>>(
            `/v1/citizen/missing-persons/${id}`,
            missingPersonFormData(input, {
              ...options,
              includeNulls: true,
            })
          ),
        photo: (id: string) =>
          client.getBlob(`/v1/citizen/missing-persons/${id}/photo`),
        close: (id: string, located: boolean) =>
          client.post<ApiResource<MissingPersonReportRecord>>(
            `/v1/citizen/missing-persons/${id}/close`,
            { located }
          ),
        remove: (id: string) =>
          client.delete<void>(`/v1/citizen/missing-persons/${id}`),
      },
    },
    admin: {
      disasters: {
        list: () =>
          client.get<ApiResource<DisasterRecord[]>>("/v1/admin/disasters"),
      },
      affectedAreas: {
        list: () =>
          client.get<ApiResource<AffectedAreaRecord[]>>(
            "/v1/admin/affected-areas"
          ),
        create: (input: AffectedAreaInput) =>
          client.post<ApiResource<AffectedAreaRecord>>(
            "/v1/admin/affected-areas",
            input
          ),
        remove: (id: number) =>
          client.delete<void>(`/v1/admin/affected-areas/${id}`),
      },
      rescueTeams: {
        list: () =>
          client.get<ApiResource<RescueTeamRecord[]>>("/v1/admin/rescue-teams"),
        create: (input: RescueTeamInput) =>
          client.post<ApiResource<RescueTeamRecord>>(
            "/v1/admin/rescue-teams",
            input
          ),
        remove: (id: number) =>
          client.delete<void>(`/v1/admin/rescue-teams/${id}`),
      },
      assignments: {
        list: () =>
          client.get<ApiResource<TeamAssignmentRecord[]>>(
            "/v1/admin/assignments"
          ),
        create: (input: TeamAssignmentInput) =>
          client.post<ApiResource<TeamAssignmentRecord>>(
            "/v1/admin/assignments",
            input
          ),
        updateStatus: (id: number, status: string) =>
          client.patch<ApiResource<TeamAssignmentRecord>>(
            `/v1/admin/assignments/${id}/status`,
            { status }
          ),
        remove: (id: number) =>
          client.delete<void>(`/v1/admin/assignments/${id}`),
      },
      shelters: {
        list: () =>
          client.get<ApiResource<ShelterRecord[]>>("/v1/admin/shelters"),
        create: (input: ShelterInput) =>
          client.post<ApiResource<ShelterRecord>>("/v1/admin/shelters", input),
        remove: (id: number) => client.delete<void>(`/v1/admin/shelters/${id}`),
      },
      warehouses: {
        list: () =>
          client.get<ApiResource<WarehouseRecord[]>>("/v1/admin/warehouses"),
        create: (input: WarehouseInput) =>
          client.post<ApiResource<WarehouseRecord>>(
            "/v1/admin/warehouses",
            input
          ),
        remove: (id: number) =>
          client.delete<void>(`/v1/admin/warehouses/${id}`),
      },
      donations: {
        list: () =>
          client.get<ApiResource<DonationRecord[]>>("/v1/admin/donations"),
        create: (input: DonationInput) =>
          client.post<ApiResource<DonationRecord>>(
            "/v1/admin/donations",
            input
          ),
        remove: (id: number) =>
          client.delete<void>(`/v1/admin/donations/${id}`),
      },
    },
  }
}
