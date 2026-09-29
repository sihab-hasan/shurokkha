import type {
  AlertInput,
  AlertRecord,
  AlertResource,
  ApiResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminAlerts = (client: ApiClient) => ({
  list: () => client.get<ApiResource<AlertRecord[]>>("/v1/admin/alerts"),
  get: (id: number) =>
    client.get<ApiResource<AlertRecord>>(`/v1/admin/alerts/${id}`),
  create: (input: AlertInput) =>
    client.post<AlertResource>("/v1/admin/alerts", input),
  update: (id: number, input: Partial<AlertInput>) =>
    client.patch<AlertResource>(`/v1/admin/alerts/${id}`, input),
  remove: (id: number) => client.delete<void>(`/v1/admin/alerts/${id}`),
})
