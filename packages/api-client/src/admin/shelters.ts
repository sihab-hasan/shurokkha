import type {
  ApiResource,
  ShelterInput,
  ShelterListResource,
  ShelterOccupancyInput,
  ShelterOccupancyResource,
  ShelterRecord,
  ShelterResource,
  ShelterUpdateInput,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export interface AdminShelterListParams {
  status?: string
  area_id?: number
  per_page?: number
  page?: number
}

export const adminShelters = (client: ApiClient) => ({
  list: (params: AdminShelterListParams = {}) =>
    client.get<ShelterListResource>(`/v1/admin/shelters${queryString(params)}`),
  get: (id: number) => client.get<ShelterResource>(`/v1/admin/shelters/${id}`),
  create: (input: ShelterInput) =>
    client.post<ShelterResource>("/v1/admin/shelters", input),
  update: (id: number, input: ShelterUpdateInput) =>
    client.patch<ShelterResource>(`/v1/admin/shelters/${id}`, input),
  updateOccupancy: (id: number, input: ShelterOccupancyInput) =>
    client.patch<ShelterOccupancyResource>(
      `/v1/admin/shelters/${id}/occupancy`,
      input
    ),
  remove: (id: number) => client.delete<void>(`/v1/admin/shelters/${id}`),
})

export type { ShelterRecord, ApiResource }
