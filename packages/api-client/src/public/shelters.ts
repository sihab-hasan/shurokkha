import type {
  ApiResource,
  PublicShelterListMeta,
  PublicShelterRecord,
  PublicShelterStatus,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const publicShelters = (client: ApiClient) => ({
  list: (
    params: {
      status?: PublicShelterStatus
      only_available?: boolean
    } = {}
  ) =>
    client.get<
      ApiResource<PublicShelterRecord[]> & {
        meta?: PublicShelterListMeta
      }
    >(`/v1/public/shelters${queryString(params)}`),
  get: (id: number) =>
    client.get<ApiResource<PublicShelterRecord>>(`/v1/public/shelters/${id}`),
})
