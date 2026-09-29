import type {
  ApiResource,
  NewsInput,
  NewsRecord,
  NewsResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminNews = (client: ApiClient) => ({
  list: () => client.get<ApiResource<NewsRecord[]>>("/v1/admin/news"),
  get: (id: number) =>
    client.get<ApiResource<NewsRecord>>(`/v1/admin/news/${id}`),
  create: (input: NewsInput) =>
    client.post<NewsResource>("/v1/admin/news", input),
  update: (id: number, input: Partial<NewsInput>) =>
    client.patch<NewsResource>(`/v1/admin/news/${id}`, input),
  remove: (id: number) => client.delete<void>(`/v1/admin/news/${id}`),
})
