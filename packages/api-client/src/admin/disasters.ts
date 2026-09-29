import type {
  ApiResource,
  DisasterInput,
  DisasterListResource,
  DisasterRecord,
  DisasterResource,
  DisasterUpdateInput,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export interface AdminDisasterListParams {
  status?: string
  severity?: string
  per_page?: number
  page?: number
}

export const adminDisasters = (client: ApiClient) => ({
  list: (params: AdminDisasterListParams = {}) =>
    client.get<DisasterListResource>(
      `/v1/admin/disasters${queryString(params)}`
    ),
  get: (id: number) =>
    client.get<DisasterResource>(`/v1/admin/disasters/${id}`),
  create: (input: DisasterInput) =>
    client.post<DisasterResource>("/v1/admin/disasters", input),
  update: (id: number, input: DisasterUpdateInput) =>
    client.patch<DisasterResource>(`/v1/admin/disasters/${id}`, input),
  remove: (id: number) => client.delete<void>(`/v1/admin/disasters/${id}`),
})

// Keep the legacy re-export shape for backward compatibility.
export type { DisasterRecord, ApiResource }
