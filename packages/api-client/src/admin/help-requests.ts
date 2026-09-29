import type {
  AdminHelpRequestListParams,
  HelpRequestAssignInput,
  HelpRequestInput,
  HelpRequestListResource,
  HelpRequestResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const adminHelpRequests = (client: ApiClient) => ({
  list: (params: AdminHelpRequestListParams = {}) =>
    client.get<HelpRequestListResource>(
      `/v1/admin/help-requests${queryString(params)}`
    ),
  get: (id: number) =>
    client.get<HelpRequestResource>(`/v1/admin/help-requests/${id}`),
  create: (input: HelpRequestInput) =>
    client.post<HelpRequestResource>("/v1/admin/help-requests", input),
  assign: (id: number, input: HelpRequestAssignInput) =>
    client.patch<HelpRequestResource>(
      `/v1/admin/help-requests/${id}/assign`,
      input
    ),
  remove: (id: number) => client.delete<void>(`/v1/admin/help-requests/${id}`),
})
