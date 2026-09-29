import type { ApiResource } from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export interface AdminEmergencyRequestRecord {
  request_id: number
  user_id: number
  area_id: number
  priority: string
  status: string
  request_at: string
  citizen_name?: string
  citizen_phone?: string
}

export const adminEmergencyRequests = (client: ApiClient) => ({
  list: () =>
    client.get<ApiResource<AdminEmergencyRequestRecord[]>>(
      "/v1/admin/emergency-requests"
    ),
})
