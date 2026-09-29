import type {
  ApiResource,
  GuideInput,
  GuideRecord,
  GuideResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminGuides = (client: ApiClient) => ({
  list: () => client.get<ApiResource<GuideRecord[]>>("/v1/admin/guides"),
  get: (id: number) =>
    client.get<ApiResource<GuideRecord>>(`/v1/admin/guides/${id}`),
  create: (input: GuideInput) =>
    client.post<GuideResource>("/v1/admin/guides", input),
  update: (id: number, input: Partial<GuideInput>) =>
    client.patch<GuideResource>(`/v1/admin/guides/${id}`, input),
  remove: (id: number) => client.delete<void>(`/v1/admin/guides/${id}`),
})
