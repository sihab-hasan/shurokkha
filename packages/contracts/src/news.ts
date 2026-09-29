import type { ApiResource, PaginatedResource } from "./core"

/**
 * Editorial categories for a news post.
 */
export const NEWS_CATEGORIES = [
  "general",
  "response",
  "recovery",
  "announcement",
] as const
export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

/**
 * Lifecycle status of a news post. Only `published` posts are
 * surfaced through the public `/v1/public/news` endpoints.
 */
export const NEWS_STATUSES = ["draft", "published", "archived"] as const
export type NewsStatus = (typeof NEWS_STATUSES)[number]

/**
 * One news post row. `slug` is the unique public identifier.
 */
export interface NewsRecord {
  news_id: number
  title: string
  slug: string
  excerpt: string | null
  body?: string
  cover_image_path: string | null
  category: NewsCategory
  status: NewsStatus
  author_id: number | null
  author_name?: string | null
  published_at: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Payload for `POST /v1/admin/news`. Slug must be globally unique.
 */
export interface NewsInput {
  title: string
  slug: string
  excerpt?: string | null
  body: string
  cover_image_path?: string | null
  category: NewsCategory
  status?: NewsStatus
  published_at?: string | null
}

export type NewsListResponse = PaginatedResource<NewsRecord>
export type NewsResource = ApiResource<NewsRecord>

export interface PublicNewsListParams {
  category?: NewsCategory
  limit?: number
}
