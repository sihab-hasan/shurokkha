import type { ApiResource } from "./core"

/**
 * Subjects an appeal can be filed against. Polymorphic association.
 */
export const APPEAL_SUBJECT_TYPES = [
  "assistance_request",
  "missing_person",
  "help_request",
] as const
export type AppealSubjectType = (typeof APPEAL_SUBJECT_TYPES)[number]

export const APPEAL_STATUSES = ["pending", "upheld", "denied"] as const
export type AppealStatus = (typeof APPEAL_STATUSES)[number]

export interface AppealRecord {
  appeal_id: number
  user_id: number | null
  user_name?: string | null
  user_email?: string | null
  subject_type: AppealSubjectType
  subject_id: number
  reason: string
  status: AppealStatus
  reviewed_by: number | null
  reviewer_name?: string | null
  reviewed_at: string | null
  decision_notes: string | null
  created_at?: string
  updated_at?: string
}

export interface AppealInput {
  subject_type: AppealSubjectType
  subject_id: number
  reason: string
}

export interface AppealReviewInput {
  status: Extract<AppealStatus, "upheld" | "denied">
  decision_notes?: string | null
}

export type AppealResource = ApiResource<AppealRecord>
export type AppealListResource = ApiResource<AppealRecord[]>
export type AdminAppealListParams = { status?: AppealStatus }
