import type {
  LoginAuditListParams,
  LoginAuditListResource,
  LoginAuditResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const adminLoginAudits = (client: ApiClient) => ({
  list: (params: LoginAuditListParams = {}) =>
    client.get<LoginAuditListResource>(
      `/v1/admin/login-audits${queryString(params)}`
    ),
  get: (id: number) =>
    client.get<LoginAuditResource>(`/v1/admin/login-audits/${id}`),
})
