import type { ApiResource } from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export interface UserEmergencyHistoryRow {
  disaster_name?: string
  severity?: string
  status?: string
  [key: string]: unknown
}

export interface CriticalAlertRow {
  alert_title?: string
  severity?: string
  [key: string]: unknown
}

export interface EscalateDisasterInput {
  disaster_id: number
  new_severity: string
}

export interface ReportDisasterAndEmergencyInput {
  disaster_name: string
  severity: string
  area_name?: string
  emergency_type?: string
  affected_population?: number
  user_id?: number
  description?: string
  priority?: string
}

export const coreTvup = (client: ApiClient) => ({
  userEmergencyHistory: () =>
    client.get<ApiResource<UserEmergencyHistoryRow[]>>("/v1/core/view"),
  criticalAlerts: () =>
    client.get<ApiResource<CriticalAlertRow[]>>("/v1/core/union"),
  escalateDisaster: (input: EscalateDisasterInput) =>
    client.post<ApiResource<unknown>>(
      "/v1/core/procedure",
      input
    ),
  reportDisasterAndEmergency: (input: ReportDisasterAndEmergencyInput) =>
    client.post<ApiResource<unknown>>(
      "/v1/core/transaction",
      input
    ),
})
