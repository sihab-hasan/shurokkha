import type { ApiResource } from "./core"

export const DOCUMENT_TYPES = ["nid", "photo", "evidence", "other"] as const
export type DocumentType = (typeof DOCUMENT_TYPES)[number]

export const DOCUMENT_STATUSES = ["uploaded", "verified", "rejected"] as const
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number]

export interface DocumentRecord {
  document_id: number
  user_id: number | null
  user_name?: string | null
  document_type: DocumentType
  title: string
  description: string | null
  file_path: string
  file_name: string
  mime_type: string
  size_bytes: number
  status: DocumentStatus
  created_at?: string
  updated_at?: string
}

export interface DocumentUploadInput {
  document_type: DocumentType
  title: string
  description?: string | null
  file: File
}

export type DocumentResource = ApiResource<DocumentRecord>
export type DocumentListResource = ApiResource<DocumentRecord[]>
