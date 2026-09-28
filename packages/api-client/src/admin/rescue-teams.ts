import type {
  ApiResource,
  RescueTeamInput,
  RescueTeamRecord,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminRescueTeams = (client: ApiClient) => ({
  list: () =>
    client.get<ApiResource<RescueTeamRecord[]>>("/v1/admin/rescue-teams"),
  create: (input: RescueTeamInput) =>
    client.post<ApiResource<RescueTeamRecord>>(
      "/v1/admin/rescue-teams",
      input
    ),
  remove: (id: number) =>
    client.delete<void>(`/v1/admin/rescue-teams/${id}`),
})