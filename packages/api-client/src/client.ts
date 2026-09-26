import type {
  AccountDeletionRequest,
  ApiResource,
  ApiUser,
  AssistanceRequestInput,
  AssistanceRequestListParams,
  AssistanceRequestRecord,
  AssistanceRequestStats,
  AuthResponse,
  BulkActionResult,
  DataExportRequest,
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
  DonationListParams,
  DonationRecord,
  DonationInput,
  DonationStats,
  LoginAudit,
  MissingPersonListParams,
  MissingPersonReportInput,
  MissingPersonReportRecord,
  NotificationPreferences,
  NotificationPreferencesInput,
  PaginatedResource,
  PaginatedResourceWithFacets,
  PrivacyPreferences,
  PrivacyPreferencesInput,
  Profile,
  ProfileInput,
  RequestAccountDeletionInput,
  RevokeAllSessionsResponse,
  TwoFactorDisableResponse,
  TwoFactorEnableResponse,
  UpdatePasswordInput,
  UserSession,
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
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue

    if (Array.isArray(value)) {
      // Multi-value params: emit `?key=a&key=b` instead of `?key=a,b`.
      // The Laravel backend's FormRequest accepts either shape, but
      // repeated params survive URL encoding roundtrips better.
      for (const entry of value) {
        if (entry === undefined || entry === null || entry === "") continue
        search.append(key, String(entry))
      }
      continue
    }

    search.set(key, String(value))
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
    resources: {
      assistanceRequests: {
        list: (params: AssistanceRequestListParams = {}) =>
          client.get<PaginatedResourceWithFacets<AssistanceRequestRecord>>(
            `/v1/assistance-requests${queryString(params)}`
          ),
        stats: () =>
          client.get<ApiResource<AssistanceRequestStats>>(
            "/v1/assistance-requests/stats"
          ),
        get: (id: string) =>
          client.get<ApiResource<AssistanceRequestRecord>>(
            `/v1/assistance-requests/${id}`
          ),
        create: (input: AssistanceRequestInput) =>
          client.post<ApiResource<AssistanceRequestRecord>>(
            "/v1/assistance-requests",
            input
          ),
        update: (id: string, input: Partial<AssistanceRequestInput>) =>
          client.patch<ApiResource<AssistanceRequestRecord>>(
            `/v1/assistance-requests/${id}`,
            input
          ),
        cancel: (id: string) =>
          client.post<ApiResource<AssistanceRequestRecord>>(
            `/v1/assistance-requests/${id}/cancel`
          ),
        bulkCancel: (ids: string[]) =>
          client.post<ApiResource<BulkActionResult>>(
            "/v1/assistance-requests/bulk-cancel",
            { ids }
          ),
        remove: (id: string) =>
          client.delete<void>(`/v1/assistance-requests/${id}`),
      },
      missingPersons: {
        list: (params: MissingPersonListParams = {}) =>
          client.get<PaginatedResourceWithFacets<MissingPersonReportRecord>>(
            `/v1/missing-persons${queryString(params)}`
          ),
        get: (id: string) =>
          client.get<ApiResource<MissingPersonReportRecord>>(
            `/v1/missing-persons/${id}`
          ),
        create: (input: MissingPersonReportInput, photo?: File | null) =>
          client.postForm<ApiResource<MissingPersonReportRecord>>(
            "/v1/missing-persons",
            missingPersonFormData(input, { photo })
          ),
        update: (
          id: string,
          input: MissingPersonReportInput,
          options: { photo?: File | null; removePhoto?: boolean } = {}
        ) =>
          client.patchForm<ApiResource<MissingPersonReportRecord>>(
            `/v1/missing-persons/${id}`,
            missingPersonFormData(input, {
              ...options,
              includeNulls: true,
            })
          ),
        photo: (id: string) =>
          client.getBlob(`/v1/missing-persons/${id}/photo`),
        close: (id: string, located: boolean) =>
          client.post<ApiResource<MissingPersonReportRecord>>(
            `/v1/missing-persons/${id}/close`,
            { located }
          ),
        bulkClose: (ids: string[]) =>
          client.post<ApiResource<BulkActionResult>>(
            "/v1/missing-persons/bulk-close",
            { ids }
          ),
        remove: (id: string) =>
          client.delete<void>(`/v1/missing-persons/${id}`),
      },
      donations: {
        list: (params: DonationListParams = {}) =>
          client.get<PaginatedResource<DonationRecord>>(
            `/v1/donations${queryString(params)}`
          ),
        stats: () =>
          client.get<ApiResource<DonationStats>>("/v1/donations/stats"),
        get: (id: number) =>
          client.get<ApiResource<DonationRecord>>(`/v1/donations/${id}`),
        create: (input: DonationInput) =>
          client.post<ApiResource<DonationRecord>>("/v1/donations", input),
        cancel: (id: number) =>
          client.post<ApiResource<DonationRecord>>(
            `/v1/donations/${id}/cancel`
          ),
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
    settings: {
      profile: {
        get: () => client.get<ApiResource<Profile>>("/v1/auth/me/profile"),
        update: (input: ProfileInput) =>
          client.patch<ApiResource<Profile>>("/v1/auth/me/profile", input),
        updatePassword: (input: UpdatePasswordInput) =>
          client.patch<ApiResource<null>>(
            "/v1/auth/me/profile/password",
            input
          ),
        uploadAvatar: (file: File) => {
          const form = new FormData()
          form.append("avatar", file)
          return client.postForm<ApiResource<Profile>>(
            "/v1/auth/me/profile/avatar",
            form
          )
        },
        destroyAvatar: () =>
          client.delete<ApiResource<Profile>>("/v1/auth/me/profile/avatar"),
      },
      notifications: {
        get: () =>
          client.get<ApiResource<NotificationPreferences>>(
            "/v1/auth/me/notification-preferences"
          ),
        update: (input: NotificationPreferencesInput) =>
          client.put<ApiResource<NotificationPreferences>>(
            "/v1/auth/me/notification-preferences",
            input
          ),
      },
      privacy: {
        get: () =>
          client.get<ApiResource<PrivacyPreferences>>(
            "/v1/auth/me/privacy-preferences"
          ),
        update: (input: PrivacyPreferencesInput) =>
          client.put<ApiResource<PrivacyPreferences>>(
            "/v1/auth/me/privacy-preferences",
            input
          ),
        dataExport: {
          get: () =>
            client.get<ApiResource<DataExportRequest>>(
              "/v1/auth/me/data-export"
            ),
          request: () =>
            client.post<ApiResource<DataExportRequest>>(
              "/v1/auth/me/data-export"
            ),
        },
        accountDeletion: {
          get: () =>
            client.get<ApiResource<AccountDeletionRequest>>(
              "/v1/auth/me/account-deletion"
            ),
          request: (input: RequestAccountDeletionInput) =>
            client.post<ApiResource<AccountDeletionRequest>>(
              "/v1/auth/me/account-deletion",
              input
            ),
          cancel: () =>
            client.delete<ApiResource<null>>("/v1/auth/me/account-deletion"),
        },
      },
      sessions: {
        current: () =>
          client.get<ApiResource<UserSession>>("/v1/auth/me/session"),
        list: () =>
          client.get<ApiResource<UserSession[]>>("/v1/auth/me/sessions"),
        revokeAll: () =>
          client.post<ApiResource<RevokeAllSessionsResponse>>(
            "/v1/auth/me/sessions/revoke-all"
          ),
      },
      twoFactor: {
        enable: () =>
          client.post<ApiResource<TwoFactorEnableResponse>>(
            "/v1/auth/me/two-factor/enable"
          ),
        disable: () =>
          client.post<ApiResource<TwoFactorDisableResponse>>(
            "/v1/auth/me/two-factor/disable"
          ),
      },
      loginAudits: {
        list: (limit = 20) =>
          client.get<ApiResource<LoginAudit[]>>(
            `/v1/auth/me/login-audits?limit=${limit}`
          ),
      },
    },
  }
}
