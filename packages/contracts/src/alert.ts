import type { ApiResource, PaginatedResource } from "./core"

/**
 * Severity levels for an {@link AlertRecord}.
 *
 * Maps to the backend `alerts.severity` enum.
 */
export const ALERT_SEVERITIES = ["info", "warning", "critical"] as const
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number]

/**
 * Lifecycle status of an alert. Admins transition between these; the
 * public endpoint only surfaces `active` rows (and not-yet-expired).
 */
export const ALERT_STATUSES = ["active", "expired", "cancelled"] as const
export type AlertStatus = (typeof ALERT_STATUSES)[number]

/**
 * One alert row, matching the Laravel `alerts` table.
 */
export interface AlertRecord {
  alert_id: number
  disaster_id: number | null
  disaster_name?: string | null
  title: string
  message: string
  severity: AlertSeverity
  status: AlertStatus
  area_description: string | null
  latitude: number | null
  longitude: number | null
  issued_by: number | null
  issued_at: string | null
  expires_at: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Payload for `POST /v1/admin/alerts`.
 *
 * `disaster_id`, `area_description`, `latitude`, `longitude`, and
 * `expires_at` are optional — useful when an alert is area-wide or
 * platform-wide rather than tied to a single disaster event.
 */
export interface AlertInput {
  disaster_id?: number | null
  title: string
  message: string
  severity: AlertSeverity
  status?: AlertStatus
  area_description?: string | null
  latitude?: number | null
  longitude?: number | null
  expires_at?: string | null
}

export type AlertListResponse = PaginatedResource<AlertRecord>
export type AlertResource = ApiResource<AlertRecord>

/**
 * Optional query string for `GET /v1/public/alerts`. The `include_expired`
 * flag surfaces historically expired alerts for transparency views.
 */
export interface PublicAlertListParams {
  include_expired?: boolean
}
