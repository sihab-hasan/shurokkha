import type { ApiResource, LoginAudit } from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const loginAudits = (client: ApiClient) => ({
  list: (limit = 20) =>
    client.get<ApiResource<LoginAudit[]>>(
      `/v1/auth/me/login-audits?limit=${limit}`
    ),
})