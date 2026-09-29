import type {
  AdminAppealListParams,
  AppealInput,
  AppealListResource,
  AppealResource,
  AppealReviewInput,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const adminAppeals = (client: ApiClient) => ({
  list: (params: AdminAppealListParams = {}) =>
    client.get<AppealListResource>(`/v1/admin/appeals${queryString(params)}`),
  get: (id: number) => client.get<AppealResource>(`/v1/admin/appeals/${id}`),
  create: (input: AppealInput) =>
    client.post<AppealResource>("/v1/admin/appeals", input),
  review: (id: number, input: AppealReviewInput) =>
    client.patch<AppealResource>(`/v1/admin/appeals/${id}/review`, input),
  remove: (id: number) => client.delete<void>(`/v1/admin/appeals/${id}`),
})
