import type {
  ApiResource,
  FundraiseInput,
  FundraiseRecord,
  FundraiseResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminFundraises = (client: ApiClient) => ({
  list: () =>
    client.get<ApiResource<FundraiseRecord[]>>("/v1/admin/fundraises"),
  get: (id: number) =>
    client.get<ApiResource<FundraiseRecord>>(`/v1/admin/fundraises/${id}`),
  create: (input: FundraiseInput) =>
    client.post<FundraiseResource>("/v1/admin/fundraises", input),
  update: (id: number, input: Partial<FundraiseInput>) =>
    client.patch<FundraiseResource>(`/v1/admin/fundraises/${id}`, input),
  remove: (id: number) => client.delete<void>(`/v1/admin/fundraises/${id}`),
})
