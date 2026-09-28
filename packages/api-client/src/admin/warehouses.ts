import type {
  ApiResource,
  WarehouseInput,
  WarehouseRecord,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminWarehouses = (client: ApiClient) => ({
  list: () =>
    client.get<ApiResource<WarehouseRecord[]>>("/v1/admin/warehouses"),
  create: (input: WarehouseInput) =>
    client.post<ApiResource<WarehouseRecord>>(
      "/v1/admin/warehouses",
      input
    ),
  remove: (id: number) =>
    client.delete<void>(`/v1/admin/warehouses/${id}`),
})