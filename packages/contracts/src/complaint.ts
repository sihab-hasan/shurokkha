import type { ApiResource } from "./core"

export const COMPLAINT_STATUSES = [
  "pending",
  "under_review",
  "resolved",
  "rejected",
] as const
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number]

export const COMPLAINT_CATEGORIES = [
  "general",
  "service",
  "logistics",
  "staff",
] as const
export type ComplaintCategory = (typeof COMPLAINT_CATEGORIES)[number]

export interface ComplaintRecord {
  complaint_id: number
  user_id: number | null
  user_name?: string | null
  user_email?: string | null
  subject: string
  description: string
  category: ComplaintCategory
  status: ComplaintStatus
  reviewed_by: number | null
  reviewer_name?: string | null
  reviewed_at: string | null
  resolution_notes: string | null
  created_at?: string
  updated_at?: string
}

export interface ComplaintInput {
  subject: string
  description: string
  category: ComplaintCategory
}

export interface ComplaintReviewInput {
  status: ComplaintStatus
  resolution_notes?: string | null
}

export type ComplaintResource = ApiResource<ComplaintRecord>
export type ComplaintListResource = ApiResource<ComplaintRecord[]>
export type AdminComplaintListParams = { status?: ComplaintStatus }
