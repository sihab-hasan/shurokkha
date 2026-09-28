import type {
  ApiResource,
  PublicDisasterListMeta,
  PublicDisasterRecord,
  PublicDisasterSeverity,
  PublicDisasterStatus,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const publicDisasters = (client: ApiClient) => ({
  list: (
    params: {
      status?: PublicDisasterStatus
      severity?: PublicDisasterSeverity
    } = {}
  ) =>
    client.get<
      ApiResource<PublicDisasterRecord[]> & {
        meta?: PublicDisasterListMeta
      }
    >(`/v1/public/disasters${queryString(params)}`),
  get: (id: number) =>
    client.get<ApiResource<PublicDisasterRecord>>(
      `/v1/public/disasters/${id}`
    ),
})
