/**
 * Public-facing contracts for unauthenticated read endpoints.
 *
 * These power the public website (guests visiting `/disasters`,
 * `/shelters`, `/map`, `/u/{username}`). Field shapes are intentionally
 * a strict subset of the admin counterparts — phone numbers, emails,
 * and other private values are NOT exposed.
 */

export type PublicDisasterStatus = "active" | "monitoring" | "resolved"

export type PublicDisasterSeverity = "Critical" | "High" | "Medium" | "Low"

export interface PublicDisasterRecord {
  disaster_id: number
  disaster_name: string
  severity: PublicDisasterSeverity | null
  status: PublicDisasterStatus | null
  start_datetime: string | null
  affected_areas_count: number | null
  total_affected_population: number | null
}

export interface PublicDisasterListMeta {
  statuses: PublicDisasterStatus[]
  severities: PublicDisasterSeverity[]
}

export type PublicShelterStatus = "open" | "full" | "closed"

export interface PublicShelterRecord {
  shelter_id: number
  shelter_name: string
  area_id: number | null
  area_severity: PublicDisasterSeverity | null
  capacity: number
  occupancy: number
  available_seats: number
  status: PublicShelterStatus | null
}

export interface PublicShelterListMeta {
  statuses: PublicShelterStatus[]
}

export interface PublicAffectedAreaRecord {
  area_id: number
  disaster_id: number | null
  disaster_name: string | null
  affected_population: number
  severity: PublicDisasterSeverity | null
}

export interface PublicProfileMetrics {
  donations: number
  assistance_requests: number
}

export interface PublicProfileRecord {
  user_id: string | number
  name: string
  username: string
  role: "user" | "admin"
  bio: string | null
  location: string | null
  joined_at: string | null
  avatar_url: string | null
  metrics: PublicProfileMetrics
}
