import type { ApiResource, PaginatedResource } from "./core"

/**
 * Application status.
 *
 * - `pending` — newly submitted, awaiting admin review.
 * - `approved` — accepted into the volunteer pool.
 * - `rejected` — declined; admins should leave `review_notes`.
 */
export const VOLUNTEER_STATUSES = ["pending", "approved", "rejected"] as const
export type VolunteerStatus = (typeof VOLUNTEER_STATUSES)[number]

/**
 * One volunteer application. `user_id` is nullable so that denormalized
 * applications can outlive deleted accounts.
 */
export interface VolunteerRecord {
  volunteer_id: number
  user_id: number | null
  user_full_name?: string | null
  full_name: string
  phone: string
  email: string | null
  address: string | null
  skills: string | null
  availability: string | null
  motivation: string | null
  status: VolunteerStatus
  reviewed_by: number | null
  reviewer_name?: string | null
  reviewed_at: string | null
  review_notes: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Payload for `POST /v1/auth/me/volunteer` (citizen self-service).
 */
export interface VolunteerInput {
  full_name: string
  phone: string
  email?: string | null
  address?: string | null
  skills?: string | null
  availability?: string | null
  motivation?: string | null
}

/**
 * Payload for `PATCH /v1/admin/volunteers/{id}/review`.
 */
export interface VolunteerReviewInput {
  status: Extract<VolunteerStatus, "approved" | "rejected">
  review_notes?: string | null
}

export type VolunteerListResponse = PaginatedResource<VolunteerRecord>
export type VolunteerResource = ApiResource<VolunteerRecord>

export interface AdminVolunteerListParams {
  status?: VolunteerStatus
}
