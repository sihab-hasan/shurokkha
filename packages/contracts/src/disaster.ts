export interface DisasterRecord {
  disaster_id: number
  disaster_name: string
}

export interface AffectedAreaRecord {
  area_id: number
  disaster_id: number
  location_id: number
  affected_population: number
  severity: "Critical" | "High" | "Medium" | "Low"
  created_at: string | null
  updated_at: string | null
}

export interface AffectedAreaInput {
  disaster_id: number
  location_id: number
  affected_population: number
  severity: "Critical" | "High" | "Medium" | "Low"
}
