import type { ApiResource } from "./core"

export const HELP_REQUEST_TYPES = [
  "rescue",
  "medical",
  "essentials",
  "shelter",
  "other",
] as const
export type HelpRequestType = (typeof HELP_REQUEST_TYPES)[number]

export const HELP_REQUEST_PRIORITIES = [
  "low",
  "normal",
  "high",
  "critical",
] as const
export type HelpRequestPriority = (typeof HELP_REQUEST_PRIORITIES)[number]

export const HELP_REQUEST_STATUSES = [
  "pending",
  "assigned",
  "in_progress",
  "resolved",
  "cancelled",
] as const
export type HelpRequestStatus = (typeof HELP_REQUEST_STATUSES)[number]

export interface HelpRequestRecord {
  help_request_id: number
  user_id: number | null
  user_name?: string | null
  user_phone?: string | null
  disaster_id: number | null
  disaster_name?: string | null
  request_type: HelpRequestType
  priority: HelpRequestPriority
  description: string
  affected_people_count: number
  address: string
  latitude: number | null
  longitude: number | null
  contact_phone: string
  status: HelpRequestStatus
  assigned_team_id: number | null
  assigned_team_name?: string | null
  reviewed_by: number | null
  reviewed_at: string | null
  resolution_notes: string | null
  created_at?: string
  updated_at?: string
}

export interface HelpRequestInput {
  disaster_id?: number | null
  request_type: HelpRequestType
  priority: HelpRequestPriority
  description: string
  affected_people_count: number
  address: string
  latitude?: number | null
  longitude?: number | null
  contact_phone: string
}

export interface HelpRequestAssignInput {
  assigned_team_id: number
}

export type HelpRequestResource = ApiResource<HelpRequestRecord>
export type HelpRequestListResource = ApiResource<HelpRequestRecord[]>
export type AdminHelpRequestListParams = {
  status?: HelpRequestStatus
  priority?: HelpRequestPriority
}
