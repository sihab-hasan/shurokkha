export interface WarehouseRecord {
  warehouse_id: number
  warehouse_name: string
  location_id: number | null
  manager_id: number | null
  created_at: string | null
  updated_at: string | null
}

export interface WarehouseInput {
  warehouse_name: string
  location_id?: number | null
  manager_id?: number | null
}
