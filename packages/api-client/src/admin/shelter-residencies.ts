import type {
  AdminShelterResidencyListParams,
  ShelterResidencyInput,
  ShelterResidencyListResource,
  ShelterResidencyResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const adminShelterResidencies = (client: ApiClient) => ({
  list: (params: AdminShelterResidencyListParams = {}) =>
    client.get<ShelterResidencyListResource>(
      `/v1/admin/shelter-residencies${queryString(params)}`
    ),
  get: (id: number) =>
    client.get<ShelterResidencyResource>(`/v1/admin/shelter-residencies/${id}`),
  create: (input: ShelterResidencyInput) =>
    client.post<ShelterResidencyResource>(
      "/v1/admin/shelter-residencies",
      input
    ),
  checkOut: (id: number) =>
    client.patch<ShelterResidencyResource>(
      `/v1/admin/shelter-residencies/${id}/checkout`
    ),
  remove: (id: number) =>
    client.delete<void>(`/v1/admin/shelter-residencies/${id}`),
})
