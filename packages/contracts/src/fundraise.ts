import type { ApiResource, PaginatedResource } from "./core"

/**
 * Lifecycle status of a fundraise campaign.
 */
export const FUNDRAISE_STATUSES = [
  "active",
  "paused",
  "completed",
  "cancelled",
] as const
export type FundraiseStatus = (typeof FUNDRAISE_STATUSES)[number]

/**
 * One fundraise campaign row.
 *
 * `raised_amount` is a running counter — admins increment it through
 * a separate donations reconciliation flow; this table only stores
 * the campaign-level totals.
 */
export interface FundraiseRecord {
  fundraise_id: number
  title: string
  slug: string
  summary: string | null
  description?: string
  cover_image_path: string | null
  goal_amount: number
  raised_amount: number
  currency: string
  status: FundraiseStatus
  starts_at: string | null
  ends_at: string | null
  organizer_id: number | null
  organizer_name?: string | null
  beneficiary_name: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Payload for `POST /v1/admin/fundraises`.
 */
export interface FundraiseInput {
  title: string
  slug: string
  summary?: string | null
  description: string
  cover_image_path?: string | null
  goal_amount: number
  raised_amount?: number
  currency?: string
  status?: FundraiseStatus
  starts_at?: string | null
  ends_at?: string | null
  beneficiary_name?: string | null
}

export type FundraiseListResponse = PaginatedResource<FundraiseRecord>
export type FundraiseResource = ApiResource<FundraiseRecord>

export interface PublicFundraiseListParams {
  status?: FundraiseStatus
  limit?: number
}
