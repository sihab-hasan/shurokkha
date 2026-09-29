import type {
  ApiResource,
  WarehouseInput,
  WarehouseRecord,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export interface AdminWarehouseDistributeInput {
  area_id: number
  resource_id: number
  quantity: number
  shelter_id?: number | null
}

export interface AdminWarehouseDistributeResult {
  distribution_id: number
  warehouse_id: number
  resource_id: number
  quantity_deducted: number
  remaining_stock: number
  status: string
}

export interface AdminWarehouseListResource {
  data: WarehouseRecord[]
}

export const adminWarehouses = (client: ApiClient) => ({
  list: () => client.get<AdminWarehouseListResource>("/v1/admin/warehouses"),
  create: (input: WarehouseInput) =>
    client.post<ApiResource<WarehouseRecord>>("/v1/admin/warehouses", input),
  remove: (id: number) => client.delete<void>(`/v1/admin/warehouses/${id}`),
  distribute: (id: number, input: AdminWarehouseDistributeInput) =>
    client.post<ApiResource<AdminWarehouseDistributeResult>>(
      `/v1/admin/warehouses/${id}/distribute`,
      input
    ),
})
