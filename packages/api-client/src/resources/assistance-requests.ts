import type {
  ApiResource,
  AssistanceRequestInput,
  AssistanceRequestListParams,
  AssistanceRequestRecord,
  AssistanceRequestStats,
  BulkActionResult,
  PaginatedResourceWithFacets,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const assistanceRequests = (client: ApiClient) => ({
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
  remove: (id: string) => client.delete<void>(`/v1/assistance-requests/${id}`),
})
