import type {
  ApiResource,
  AlertRecord,
  PublicAlertListParams,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const publicAlerts = (client: ApiClient) => ({
  list: (params: PublicAlertListParams = {}) =>
    client.get<ApiResource<AlertRecord[]>>(
      `/v1/public/alerts${queryString(params)}`
    ),
  get: (id: number) =>
    client.get<ApiResource<AlertRecord>>(`/v1/public/alerts/${id}`),
})
