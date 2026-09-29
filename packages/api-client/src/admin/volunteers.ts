import type {
  AdminVolunteerListParams,
  ApiResource,
  VolunteerRecord,
  VolunteerResource,
  VolunteerReviewInput,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const adminVolunteers = (client: ApiClient) => ({
  list: (params: AdminVolunteerListParams = {}) =>
    client.get<ApiResource<VolunteerRecord[]>>(
      `/v1/admin/volunteers${queryString(params)}`
    ),
  get: (id: number) =>
    client.get<ApiResource<VolunteerRecord>>(`/v1/admin/volunteers/${id}`),
  review: (id: number, input: VolunteerReviewInput) =>
    client.patch<VolunteerResource>(`/v1/admin/volunteers/${id}/review`, input),
  remove: (id: number) => client.delete<void>(`/v1/admin/volunteers/${id}`),
})
