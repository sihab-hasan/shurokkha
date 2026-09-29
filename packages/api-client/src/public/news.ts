import type {
  ApiResource,
  NewsRecord,
  PublicNewsListParams,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const publicNews = (client: ApiClient) => ({
  list: (params: PublicNewsListParams = {}) =>
    client.get<ApiResource<NewsRecord[]>>(
      `/v1/public/news${queryString(params)}`
    ),
  get: (slug: string) =>
    client.get<ApiResource<NewsRecord>>(`/v1/public/news/${slug}`),
})
