import type {
  AffectedAreaInput,
  RescueTeamInput,
  TeamAssignmentInput,
} from "@shurokkha/contracts"

export type AffectedAreaSeverity = AffectedAreaInput["severity"]

export type RescueTeamAvailability = RescueTeamInput["availability"]

export type AssignmentStatus = TeamAssignmentInput["status"]

export interface AffectedAreaAdminRecord {
  area_id: number
  disaster_id: number
  location_id: number | null
  affected_population: number
  severity: string
  disaster_name?: string
  disaster_severity?: string
  disaster_status?: string
  created_at: string | null
}

export interface RescueTeamAdminRecord {
  team_id: number
  team_name: string
  team_type: string
  availability: RescueTeamAvailability
  total_assignments?: number
  created_at: string | null
  updated_at: string | null
}

export interface AssignmentAdminRecord {
  assignment_id: number
  team_id: number
  request_id: number
  status: AssignmentStatus
  assignment_at: string | null
  team_name?: string
  team_type?: string
  team_availability?: string
  request_priority?: string
  request_status?: string
  request_type?: string
  citizen_name?: string
  citizen_phone?: string
}

export interface EmergencyRequestAdminRecord {
  request_id: number
  user_id: number
  area_id: number
  priority: string
  status: string
  request_at: string
  citizen_name?: string
  citizen_phone?: string
}

export interface DisasterOption {
  disaster_id: number
  disaster_name: string
  severity: string
  status: string
}
