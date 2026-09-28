import type {
  AffectedAreaInput,
  AffectedAreaRecord,
  ApiResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminAffectedAreas = (client: ApiClient) => ({
  list: () =>
    client.get<ApiResource<AffectedAreaRecord[]>>("/v1/admin/affected-areas"),
  create: (input: AffectedAreaInput) =>
    client.post<ApiResource<AffectedAreaRecord>>(
      "/v1/admin/affected-areas",
      input
    ),
  remove: (id: number) => client.delete<void>(`/v1/admin/affected-areas/${id}`),
})
