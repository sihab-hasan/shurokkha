export type EntityId = string

export interface ApiErrorContract {
  code?: string
  message: string
  errors?: Record<string, string[]>
}

export interface ApiResource<T> {
  data: T
}

export interface PaginationLinkSet {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface PaginatedResource<T> {
  data: T[]
  links: PaginationLinkSet
  meta: PaginationMeta
}

export type UserRole = "citizen" | "donor" | "volunteer"

export interface ApiUser {
  id: number
  name: string
  email: string
  role: UserRole
  avatar_url: string | null
}

export interface AuthResponse {
  status: string
  message: string
  user: ApiUser
}

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
  latitude: number | null
  longitude: number | null
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
  latitude?: number | null
  longitude?: number | null
}

export interface AssistanceRequestListParams {
  search?: string
  status?: AssistanceRequestStatus
  type?: AssistanceRequestType
  page?: number
  per_page?: number
}

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
  status?: MissingPersonStatus
  page?: number
  per_page?: number
}
