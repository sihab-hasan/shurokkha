export interface ShelterRecord {
  shelter_id: number
  area_id: number | null
  shelter_name: string
  capacity: number
  occupancy: number
  status: "open" | "full" | "closed"
  created_at: string | null
  updated_at: string | null
}

export interface ShelterInput {
  shelter_name: string
  capacity: number
  occupancy: number
  area_id?: number | null
  status?: string
}
