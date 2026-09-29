import type {
  ApiResource,
  GuideRecord,
  PublicGuideListParams,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const publicGuides = (client: ApiClient) => ({
  list: (params: PublicGuideListParams = {}) =>
    client.get<ApiResource<GuideRecord[]>>(
      `/v1/public/guides${queryString(params)}`
    ),
  get: (slug: string) =>
    client.get<ApiResource<GuideRecord>>(`/v1/public/guides/${slug}`),
})
