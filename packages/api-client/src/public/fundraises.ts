import type {
  ApiResource,
  FundraiseRecord,
  PublicFundraiseListParams,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const publicFundraises = (client: ApiClient) => ({
  list: (params: PublicFundraiseListParams = {}) =>
    client.get<ApiResource<FundraiseRecord[]>>(
      `/v1/public/fundraises${queryString(params)}`
    ),
  get: (slug: string) =>
    client.get<ApiResource<FundraiseRecord>>(`/v1/public/fundraises/${slug}`),
})
