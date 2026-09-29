import type { ApiResource } from "./core"

/**
 * A household represents a family unit registered by a citizen.
 * One household per user — uniqueness is enforced by the backend.
 */
export interface HouseholdRecord {
  household_id: number
  user_id: number | null
  head_full_name: string
  phone: string
  address: string
  latitude: number | null
  longitude: number | null
  member_count: number
  notes: string | null
  created_at?: string
  updated_at?: string
}

/**
 * A single member under a household. Tracked individually for
 * targeted relief distribution (vulnerable-age, gender, special needs).
 */
export interface HouseholdMemberRecord {
  member_id: number
  household_id: number
  full_name: string
  relationship: string | null
  age: number | null
  gender: "female" | "male" | "other" | null
  phone: string | null
  notes: string | null
  created_at?: string
  updated_at?: string
}

export interface HouseholdInput {
  head_full_name: string
  phone: string
  address: string
  latitude?: number | null
  longitude?: number | null
  member_count?: number
  notes?: string | null
}

export interface HouseholdUpdateInput {
  head_full_name?: string
  phone?: string
  address?: string
  latitude?: number | null
  longitude?: number | null
  member_count?: number
  notes?: string | null
}

export interface HouseholdMemberInput {
  full_name: string
  relationship?: string | null
  age?: number | null
  gender?: "female" | "male" | "other" | null
  phone?: string | null
  notes?: string | null
}

export interface HouseholdMemberUpdateInput {
  full_name?: string
  relationship?: string | null
  age?: number | null
  gender?: "female" | "male" | "other" | null
  phone?: string | null
  notes?: string | null
}

export interface HouseholdWithMembers {
  household: HouseholdRecord
  members: HouseholdMemberRecord[]
}

export type HouseholdResource = ApiResource<HouseholdRecord>
export type HouseholdWithMembersResource = ApiResource<HouseholdWithMembers>
export type HouseholdMemberListResource = ApiResource<HouseholdMemberRecord[]>
export type HouseholdMemberResource = ApiResource<HouseholdMemberRecord>
