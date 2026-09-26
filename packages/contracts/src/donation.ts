import type { ApiResource, PaginatedResource } from "./core"

/**
 * Canonical donation kinds (a.k.a. "type" in the UI). Doubles as the
 * `<select>` options in the donations toolbar.
 *
 * Stored in `donations.donation_kind` as a freeform string today, but
 * the frontend + backend only emit/accept these values.
 */
export const DONATION_KINDS = [
  "one_time",
  "recurring",
  "zakat",
  "sadaqah",
  "general",
] as const

export type DonationKind = (typeof DONATION_KINDS)[number]

/**
 * Donation payment methods supported by the platform.
 */
export const DONATION_PAYMENT_METHODS = [
  "bkash",
  "nagad",
  "rocket",
  "bank",
  "card",
] as const

export type DonationPaymentMethod = (typeof DONATION_PAYMENT_METHODS)[number]

/**
 * Donation lifecycle status.
 */
export const DONATION_STATUSES = [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
] as const

export type DonationStatus = (typeof DONATION_STATUSES)[number]

export interface DonationRecord {
  /** Internal numeric PK. */
  donation_id: number
  /** See {@link DONATION_KINDS}. */
  donation_kind: string
  /** Amount in the smallest unit of {@link DonationRecord.currency}. */
  amount: number
  /** ISO-4217 currency code; defaults to "BDT". */
  currency: string
  /** Freeform campaign name (e.g. "Sylhet Flood Relief Fund 2026"). */
  campaign_title: string | null
  /** See {@link DONATION_PAYMENT_METHODS}. */
  payment_method: string | null
  /** User-visible receipt number ("DON-000481"). Always populated. */
  receipt_number: string | null
  /** See {@link DONATION_STATUSES}. */
  status: string
  created_at: string | null
  updated_at: string | null
}

/**
 * Whitelisted sort columns. Anything else is rejected by the API.
 */
export type DonationSortField = "created_at" | "amount" | "campaign_title"

export type DonationSortDir = "asc" | "desc"

/**
 * Query-string parameters for `GET /v1/donations`.
 *
 * `status`/`type`/`payment_method` accept either a single string or a
 * string array — the backend normalizes both into a `WHERE IN (…)`.
 */
export interface DonationListParams {
  search?: string
  status?: string | string[]
  type?: string | string[]
  payment_method?: string | string[]
  sort?: DonationSortField
  dir?: DonationSortDir
  page?: number
  per_page?: number
}

/**
 * Stats returned by `GET /v1/donations/stats`.
 *
 * `lifetime_sum` is the total `amount` summed across all rows. Other
 * counts are row-counts (not sums).
 */
export interface DonationStats {
  total: number
  lifetime_sum: number
  recurring: number
  one_time: number
  pending: number
  completed: number
}

/**
 * Payload for `POST /v1/donations`.
 *
 * `status` is intentionally absent from this shape — the backend
 * stamps `"pending"` on creation. The frontend cannot self-approve.
 */
export type DonationInput = Pick<DonationRecord, "donation_kind" | "amount"> &
  Partial<
    Pick<
      DonationRecord,
      "payment_method" | "campaign_title" | "currency" | "receipt_number"
    >
  >

/**
 * Convenience re-export — list responses are shape-compatible with the
 * shared {@link PaginatedResource}.
 */
export type DonationListResponse = PaginatedResource<DonationRecord>
export type DonationResource = ApiResource<DonationRecord>
