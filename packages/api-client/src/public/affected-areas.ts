import type {
  ApiResource,
  PublicAffectedAreaRecord,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const publicAffectedAreas = (client: ApiClient) => ({
  list: () =>
    client.get<ApiResource<PublicAffectedAreaRecord[]>>(
      "/v1/public/affected-areas"
    ),
})
