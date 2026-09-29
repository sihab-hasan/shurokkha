import type {
  AdminFeedbackListParams,
  FeedbackInput,
  FeedbackListResource,
  FeedbackResource,
  FeedbackRespondInput,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const adminFeedback = (client: ApiClient) => ({
  list: (params: AdminFeedbackListParams = {}) =>
    client.get<FeedbackListResource>(
      `/v1/admin/feedback${queryString(params)}`
    ),
  get: (id: number) => client.get<FeedbackResource>(`/v1/admin/feedback/${id}`),
  create: (input: FeedbackInput) =>
    client.post<FeedbackResource>("/v1/admin/feedback", input),
  respond: (id: number, input: FeedbackRespondInput) =>
    client.patch<FeedbackResource>(`/v1/admin/feedback/${id}/respond`, input),
  remove: (id: number) => client.delete<void>(`/v1/admin/feedback/${id}`),
})
