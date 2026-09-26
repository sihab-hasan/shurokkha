import type { EntityId } from "./core"

export type AssistanceRequestType =
  "rescue" | "medical" | "essentials" | "shelter" | "other"

export type AssistanceRequestPriority = "critical" | "high" | "normal"

export type AssistanceRequestStatus =
  | "submitted"
  | "verified"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "cancelled"

export interface AssistanceRequestRecord {
  id: EntityId
  type: AssistanceRequestType
  priority: AssistanceRequestPriority
  description: string
  affected_people_count: number
  contact_phone: string
  address: string
  status: AssistanceRequestStatus
  submitted_at: string | null
  cancelled_at: string | null
  resolved_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface AssistanceRequestInput {
  type: AssistanceRequestType
  priority: AssistanceRequestPriority
  description: string
  affected_people_count: number
  contact_phone: string
  address: string
}

export interface AssistanceRequestListParams {
  search?: string
  /** Single value or comma-separated list of statuses. */
  status?: string
  /** Single value or comma-separated list of types. */
  type?: string
  /** Single value or comma-separated list of priorities. */
  priority?: string
  /** Whitelisted sort fields (server-controlled). */
  sort?:
    | "created_at"
    | "submitted_at"
    | "priority"
    | "status"
    | "type"
    | "affected_people_count"
  /** Sort direction. Defaults to "desc" if omitted. */
  dir?: "asc" | "desc"
  page?: number
  per_page?: number
}

export interface AssistanceRequestStats {
  total: number
  /** Count of `submitted` requests (the dashboard "Open" bucket). */
  open: number
  /** Count of `in_progress` requests. */
  in_progress: number
  /** Count of `resolved` requests. */
  resolved: number
  /** Raw `status => count` map for advanced consumers. */
  totals_by_status: Partial<Record<AssistanceRequestStatus, number>>
}
