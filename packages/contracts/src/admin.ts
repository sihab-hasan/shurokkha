import type { ApiListResource, ApiResource } from "./core"
import type { UserRole } from "./auth"

export interface AdminUserRecord {
  id: number
  name: string
  email: string
  phone?: string | null
  role: UserRole | string
  status: "active" | "suspended" | string
  created_at?: string | null
  updated_at?: string | null
}

export type AdminUserResource = ApiResource<AdminUserRecord>
export type AdminUserListResource = ApiListResource<AdminUserRecord>

export interface AdminUserInput {
  name: string
  full_name?: string
  email: string
  password?: string
  phone?: string | null
  role?: string
  status?: string
}

export interface AdminUserUpdateInput {
  name?: string
  full_name?: string
  email?: string
  password?: string
  phone?: string | null
  role?: string
  status?: string
}

export interface AdminAssignRoleInput {
  role: string
}

export interface AdminUserListParams {
  search?: string
  q?: string
  role?: string
  status?: string
  page?: number
  per_page?: number
  sort?: string
}

export interface LoginAuditRecord {
  audit_id: number
  user_id: number | null
  email: string
  ip_address?: string | null
  user_agent?: string | null
  status: "successful" | "failed" | string
  successful?: boolean
  failure_reason?: string | null
  attempted_at: string
  signed_in_at?: string | null
  created_at?: string | null
}

export type LoginAuditResource = ApiResource<LoginAuditRecord>
export type LoginAuditListResource = ApiListResource<LoginAuditRecord>

export interface LoginAuditListParams {
  email?: string
  status?: string
  successful?: boolean
  user_id?: number | null
  page?: number
  per_page?: number
  sort?: string
}

export type ReportSummaryResource = ApiResource<{
  affected_areas_count: number
  rescue_teams_count: number
  active_assignments_count: number
  total_evacuees: number
  open_shelters_count: number
  [key: string]: unknown
}>

export type AreaSeverityBreakdownResource = ApiResource<
  Array<{
    area_id: number
    area_name?: string
    severity: string
    disaster_count?: number
    population?: number
    [key: string]: unknown
  }>
>

export type ActiveRescueTeamAssignmentResource = ApiResource<
  Array<{
    team_id: number
    team_name?: string
    team_type?: string
    availability?: string
    assignment_id?: number
    status?: string
    [key: string]: unknown
  }>
>

export type CitizenRequestStatsResource = ApiResource<
  Array<{
    status: string
    count: number
    [key: string]: unknown
  }>
>

export type ShelterSummaryViewResource = ApiResource<
  Array<{
    shelter_id: number
    shelter_name: string
    capacity: number
    occupancy: number
    status: string
    [key: string]: unknown
  }>
>

export type InnerJoinResource = ApiResource<Array<Record<string, unknown>>>
export type LeftJoinResource = ApiResource<Array<Record<string, unknown>>>
export type RightJoinResource = ApiResource<Array<Record<string, unknown>>>
export type FullOuterJoinResource = ApiResource<Array<Record<string, unknown>>>
export type FacilityLocationsResource = ApiResource<
  Array<{
    facility_id: number
    name?: string
    type?: string
    latitude?: number
    longitude?: number
    [key: string]: unknown
  }>
>
