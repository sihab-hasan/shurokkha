import type { ApiListResource, ApiResource } from "./core"

export const SHELTER_STATUSES = ["open", "full", "closed"] as const
export type ShelterStatus = (typeof SHELTER_STATUSES)[number]

export interface ShelterRecord {
  shelter_id: number
  area_id: number | null
  shelter_name: string
  capacity: number
  occupancy: number
  status: ShelterStatus
  created_at: string | null
  updated_at: string | null
}

export type ShelterResource = ApiResource<ShelterRecord>
export type ShelterListResource = ApiListResource<ShelterRecord>

export interface ShelterInput {
  shelter_name: string
  capacity: number
  occupancy: number
  area_id?: number | null
  status?: ShelterStatus
}

export type ShelterUpdateInput = Partial<ShelterInput>

export interface ShelterOccupancyInput {
  occupancy: number
}

export type ShelterOccupancyResource = ApiResource<{
  shelter_id: number
  capacity: number
  occupancy: number
  available_space?: number
}>

