import type { ApiResource } from "./core"

export const FEEDBACK_STATUSES = ["pending", "reviewed", "archived"] as const
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number]

export const FEEDBACK_CATEGORIES = [
  "general",
  "app",
  "service",
  "other",
] as const
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]

export interface FeedbackRecord {
  feedback_id: number
  user_id: number | null
  user_name?: string | null
  user_email?: string | null
  subject: string
  message: string
  rating: number | null
  category: FeedbackCategory
  status: FeedbackStatus
  reviewed_by: number | null
  reviewer_name?: string | null
  reviewed_at: string | null
  response: string | null
  created_at?: string
  updated_at?: string
}

export interface FeedbackInput {
  subject: string
  message: string
  rating?: number | null
  category: FeedbackCategory
}

export interface FeedbackRespondInput {
  response: string
  status?: FeedbackStatus
}

export type FeedbackResource = ApiResource<FeedbackRecord>
export type FeedbackListResource = ApiResource<FeedbackRecord[]>
export type AdminFeedbackListParams = { status?: FeedbackStatus }
