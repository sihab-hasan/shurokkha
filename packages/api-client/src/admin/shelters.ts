import type { ApiResource, ShelterInput, ShelterRecord } from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminShelters = (client: ApiClient) => ({
  list: () => client.get<ApiResource<ShelterRecord[]>>("/v1/admin/shelters"),
  create: (input: ShelterInput) =>
    client.post<ApiResource<ShelterRecord>>("/v1/admin/shelters", input),
  remove: (id: number) => client.delete<void>(`/v1/admin/shelters/${id}`),
})