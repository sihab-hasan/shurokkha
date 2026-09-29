import type {
  AdminAssignRoleInput,
  AdminUserInput,
  AdminUserListParams,
  AdminUserListResource,
  AdminUserResource,
  AdminUserUpdateInput,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const adminUsers = (client: ApiClient) => ({
  list: (params: AdminUserListParams = {}) =>
    client.get<AdminUserListResource>(`/v1/admin/users${queryString(params)}`),
  get: (id: number) => client.get<AdminUserResource>(`/v1/admin/users/${id}`),
  create: (input: AdminUserInput) =>
    client.post<AdminUserResource>("/v1/admin/users", input),
  update: (id: number, input: AdminUserUpdateInput) =>
    client.patch<AdminUserResource>(`/v1/admin/users/${id}`, input),
  remove: (id: number) => client.delete<void>(`/v1/admin/users/${id}`),
  restore: (id: number) =>
    client.post<AdminUserResource>(`/v1/admin/users/${id}/restore`),
  assignRole: (id: number, input: AdminAssignRoleInput) =>
    client.post<AdminUserResource>(`/v1/admin/users/${id}/assign-role`, input),
})
