import type {
  AffectedAreaInput,
  RescueTeamInput,
  TeamAssignmentInput,
} from "@shurokkha/contracts"

export type {
  AlertSeverity,
  AlertStatus,
  DonationKind,
  DonationPaymentMethod,
  FundraiseStatus,
  GuideCategory,
  GuideStatus,
  NewsCategory,
  NewsStatus,
  ShelterStatus,
  VolunteerStatus,
} from "@shurokkha/contracts"

export type AffectedAreaSeverity = AffectedAreaInput["severity"]

export type RescueTeamAvailability = RescueTeamInput["availability"]

export type AssignmentStatus = TeamAssignmentInput["status"]

export type UserStatus = "active" | "suspended" | "pending" | "deleted"

export interface ReportSummaryCard {
  active_disasters?: number
  total_affected_population?: number
  active_shelters?: number
  total_shelter_capacity?: number
  total_shelter_occupancy?: number
  active_rescue_teams?: number
  open_emergency_requests?: number
  total_donations?: number
  total_donation_amount?: number
  total_volunteers?: number
  pending_volunteer_applications?: number
  [key: string]: unknown
}

export interface DisasterOption {
  disaster_id: number
  disaster_name: string
  severity: string
  status: string
}

export interface AlertAdminRecord {
  alert_id: number
  disaster_id: number | null
  disaster_name?: string
  disaster_severity?: string
  disaster_status?: string
  area_description?: string | null
  area_name?: string | null
  title: string
  message: string
  severity: string
  status: string
  starts_at?: string | null
  ends_at?: string | null
  expires_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface NewsAdminRecord {
  news_id: number
  slug?: string
  title: string
  content: string
  excerpt?: string | null
  body?: string
  author_name?: string | null
  cover_image_path?: string | null
  category: string
  status: string
  published_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface FundraiseAdminRecord {
  fundraise_id: number
  slug?: string
  title: string
  description: string
  summary?: string | null
  goal_amount: number
  raised_amount: number
  currency?: string
  beneficiary_name?: string | null
  organizer_name?: string | null
  status: string
  starts_at?: string | null
  ends_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface GuideAdminRecord {
  guide_id: number
  slug?: string
  title: string
  summary?: string | null
  content: string
  body?: string
  category: string
  author_name?: string | null
  reading_time_minutes?: number | null
  cover_image_path?: string | null
  status: string
  published_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface VolunteerAdminRecord {
  volunteer_id: number
  full_name: string
  user_full_name?: string | null
  phone: string
  email?: string | null
  skills?: string | null
  availability?: string | null
  address?: string | null
  motivation?: string | null
  reviewer_name?: string | null
  reviewed_by?: number | null
  review_notes?: string | null
  status: string
  created_at?: string | null
}

export interface ShelterAdminRecord {
  shelter_id: number
  shelter_name: string
  capacity: number
  occupancy: number
  available_capacity?: number
  occupancy_percentage?: number
  status: string
  area_id?: number | null
  area_severity?: string | null
  affected_population?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface WarehouseAdminRecord {
  warehouse_id: number
  warehouse_name: string
  location?: string | null
  location_id?: number | null
  capacity?: number
  manager_name?: string | null
  manager_email?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface DonationAdminRecord {
  donation_id: number
  donor_name: string
  amount: number
  currency?: string
  kind: string
  donation_kind?: string
  payment_method: string
  status?: string
  receipt_number?: string | null
  donor_phone?: string | null
  donor_email?: string | null
  campaign_id?: number | null
  campaign_title?: string | null
  warehouse_id?: number | null
  warehouse_name?: string | null
  notes?: string | null
  received_at?: string | null
  created_at?: string | null
}

export interface LoginAuditAdminRecord {
  audit_id: number
  user_id: number | null
  email: string
  ip_address?: string | null
  user_agent?: string | null
  status: string
  successful?: boolean
  failure_reason?: string | null
  attempted_at: string
  signed_in_at?: string | null
  signed_out_at?: string | null
}

export interface UserAdminRecord {
  id: number
  name: string
  full_name?: string
  email: string
  phone?: string | null
  role: string
  status: string
  timezone?: string | null
  email_verified_at?: string | null
  two_factor_confirmed_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface AreaSeverityBreakdownRow {
  area_id: number
  area_name?: string
  severity: string
  disaster_count?: number
  population?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface ActiveRescueTeamAssignmentRow {
  team_id: number
  team_name?: string
  team_type?: string
  availability?: string
  assignment_id?: number
  assignment_at?: string | number | Date | null
  status?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface CitizenRequestStatsRow {
  status: string
  count: number
  total_requests?: number
  resolved?: number
  pending?: number
  cancelled?: number
  user_id?: string | number
  citizen_name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface ShelterPublicSummaryRow {
  shelter_id: number
  shelter_name: string
  capacity: number
  occupancy: number
  status: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface JoinReportRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface FacilityLocationRow {
  facility_id: number
  name?: string
  type?: string
  latitude?: number
  longitude?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

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

export type ActiveTeamRow = ActiveRescueTeamAssignmentRow
export type AreaSeverityRow = AreaSeverityBreakdownRow
export type CitizenStatsRow = CitizenRequestStatsRow
export type JoinRow = JoinReportRow
export type ShelterSummaryRow = ShelterPublicSummaryRow
