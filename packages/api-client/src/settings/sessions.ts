import type {
  ApiResource,
  RevokeAllSessionsResponse,
  RevokeOneSessionResponse,
  UserSession,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const sessions = (client: ApiClient) => ({
  current: () =>
    client.get<ApiResource<UserSession>>("/v1/auth/me/session"),
  list: () =>
    client.get<ApiResource<UserSession[]>>("/v1/auth/me/sessions"),
  revokeOne: (sessionId: string) =>
    client.delete<ApiResource<RevokeOneSessionResponse>>(
      `/v1/auth/me/sessions/${encodeURIComponent(sessionId)}`
    ),
  revokeAll: () =>
    client.post<ApiResource<RevokeAllSessionsResponse>>(
      "/v1/auth/me/sessions/revoke-all"
    ),
})