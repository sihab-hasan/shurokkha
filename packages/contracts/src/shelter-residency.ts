import type { ApiResource } from "./core"

export const SHELTER_RESIDENCY_STATUSES = ["checked_in", "checked_out"] as const
export type ShelterResidencyStatus = (typeof SHELTER_RESIDENCY_STATUSES)[number]

export interface ShelterResidencyRecord {
  residency_id: number
  shelter_id: number | null
  shelter_name?: string | null
  user_id: number | null
  household_id: number | null
  full_name: string
  phone: string | null
  age: number | null
  gender: "female" | "male" | "other" | null
  notes: string | null
  status: ShelterResidencyStatus
  checked_in_at: string
  checked_out_at: string | null
  created_at?: string
  updated_at?: string
}

export interface ShelterResidencyInput {
  shelter_id: number
  full_name: string
  phone?: string | null
  age?: number | null
  gender?: "female" | "male" | "other" | null
  household_id?: number | null
  notes?: string | null
}

export type ShelterResidencyResource = ApiResource<ShelterResidencyRecord>
export type ShelterResidencyListResource = ApiResource<ShelterResidencyRecord[]>
export type AdminShelterResidencyListParams = {
  shelter_id?: number
  status?: ShelterResidencyStatus
}
