import type {
  AdminComplaintListParams,
  ComplaintInput,
  ComplaintListResource,
  ComplaintResource,
  ComplaintReviewInput,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const adminComplaints = (client: ApiClient) => ({
  list: (params: AdminComplaintListParams = {}) =>
    client.get<ComplaintListResource>(
      `/v1/admin/complaints${queryString(params)}`
    ),
  get: (id: number) =>
    client.get<ComplaintResource>(`/v1/admin/complaints/${id}`),
  create: (input: ComplaintInput) =>
    client.post<ComplaintResource>("/v1/admin/complaints", input),
  review: (id: number, input: ComplaintReviewInput) =>
    client.patch<ComplaintResource>(`/v1/admin/complaints/${id}/review`, input),
  remove: (id: number) => client.delete<void>(`/v1/admin/complaints/${id}`),
})
