import type { EntityId } from "./core"

export type MissingPersonGender = "female" | "male" | "other" | "unknown"

export type MissingPersonStatus =
  | "reported"
  | "under_review"
  | "verified"
  | "searching"
  | "located"
  | "closed"
  | "rejected"

export interface MissingPersonReportRecord {
  id: EntityId
  full_name: string
  age: number | null
  gender: MissingPersonGender | null
  has_photo: boolean
  physical_description: string | null
  distinguishing_features: string | null
  last_seen_at: string | null
  last_seen_location: string
  latitude: number | null
  longitude: number | null
  contact_phone: string
  status: MissingPersonStatus
  found_at: string | null
  closed_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface MissingPersonReportInput {
  full_name: string
  age?: number | null
  gender?: MissingPersonGender | null
  physical_description?: string | null
  distinguishing_features?: string | null
  last_seen_at: string
  last_seen_location: string
  latitude?: number | null
  longitude?: number | null
  contact_phone: string
}

export interface MissingPersonListParams {
  search?: string
  /** Single value or comma-separated list of statuses. */
  status?: string
  /** Whitelisted sort fields (server-controlled). */
  sort?: "created_at" | "last_seen_at" | "status"
  /** Sort direction. Defaults to "desc" if omitted. */
  dir?: "asc" | "desc"
  page?: number
  per_page?: number
}
