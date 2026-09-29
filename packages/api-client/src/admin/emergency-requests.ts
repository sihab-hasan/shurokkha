import type {
  ApiResource,
  AssignmentRecord,
  EmergencyRequestDetailResource,
  EmergencyRequestListResource,
  EmergencyRequestRecord,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export interface AdminEmergencyRequestListParams {
  status?: string
  priority?: string
  type?: string
  disaster_id?: number
  per_page?: number
  page?: number
}

export interface EmergencyRequestDetailResponse {
  data: EmergencyRequestRecord & {
    citizen_name?: string
    citizen_phone?: string
    citizen_email?: string
    disaster_id?: number | null
  }
  assignments: AssignmentRecord[]
}

export interface AdminEmergencyRequestUpdateInput {
  type?: string
  priority?: string
  status?: string
  description?: string | null
}

export const adminEmergencyRequests = (client: ApiClient) => ({
  list: (params: AdminEmergencyRequestListParams = {}) =>
    client.get<EmergencyRequestListResource>(
      `/v1/admin/emergency-requests${queryString(params)}`
    ),
  get: (id: number) =>
    client.get<EmergencyRequestDetailResource>(
      `/v1/admin/emergency-requests/${id}`
    ),
  update: (id: number, input: AdminEmergencyRequestUpdateInput) =>
    client.patch<EmergencyRequestDetailResource>(
      `/v1/admin/emergency-requests/${id}`,
      input
    ),
  remove: (id: number) =>
    client.delete<void>(`/v1/admin/emergency-requests/${id}`),
})

export type { ApiResource }
