import type { ApiResource, PaginatedResource } from "./core"

/**
 * Categories for the preparedness knowledge base.
 */
export const GUIDE_CATEGORIES = [
  "preparedness",
  "during",
  "after",
  "legal",
] as const
export type GuideCategory = (typeof GUIDE_CATEGORIES)[number]

/**
 * Lifecycle status of a guide. Public endpoints only return `published`.
 */
export const GUIDE_STATUSES = ["draft", "published", "archived"] as const
export type GuideStatus = (typeof GUIDE_STATUSES)[number]

/**
 * One guide row.
 */
export interface GuideRecord {
  guide_id: number
  title: string
  slug: string
  summary: string | null
  body?: string
  category: GuideCategory
  cover_image_path: string | null
  status: GuideStatus
  reading_time_minutes: number
  author_id: number | null
  author_name?: string | null
  published_at: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Payload for `POST /v1/admin/guides`.
 */
export interface GuideInput {
  title: string
  slug: string
  summary?: string | null
  body: string
  category: GuideCategory
  cover_image_path?: string | null
  status?: GuideStatus
  reading_time_minutes?: number
  published_at?: string | null
}

export type GuideListResponse = PaginatedResource<GuideRecord>
export type GuideResource = ApiResource<GuideRecord>

export interface PublicGuideListParams {
  category?: GuideCategory
  limit?: number
}
