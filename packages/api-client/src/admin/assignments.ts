import type {
  ApiResource,
  TeamAssignmentInput,
  TeamAssignmentRecord,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminAssignments = (client: ApiClient) => ({
  list: () =>
    client.get<ApiResource<TeamAssignmentRecord[]>>("/v1/admin/assignments"),
  create: (input: TeamAssignmentInput) =>
    client.post<ApiResource<TeamAssignmentRecord>>(
      "/v1/admin/assignments",
      input
    ),
  updateStatus: (id: number, status: string) =>
    client.patch<ApiResource<TeamAssignmentRecord>>(
      `/v1/admin/assignments/${id}/status`,
      { status }
    ),
  remove: (id: number) => client.delete<void>(`/v1/admin/assignments/${id}`),
})
