export interface RescueTeamRecord {
  team_id: number
  team_name: string
  team_type: string
  availability: "available" | "busy" | "offline"
  created_at: string | null
  updated_at: string | null
}

export interface RescueTeamInput {
  team_name: string
  team_type: string
  availability: "available" | "busy" | "offline"
}

export interface TeamAssignmentRecord {
  assignment_id: number
  team_id: number
  request_id: number
  status: "assigned" | "on_route" | "completed" | "cancelled"
  assignment_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface TeamAssignmentInput {
  team_id: number
  request_id: number
  status: "assigned" | "on_route" | "completed" | "cancelled"
}
