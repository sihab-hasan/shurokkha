import { z } from "zod"

export const LOGIN_AUDIT_FAILURE_REASONS = [
  "invalid_credentials",
  "account_locked",
  "account_pending",
] as const

export type LoginAuditFailureReason =
  (typeof LOGIN_AUDIT_FAILURE_REASONS)[number]

export interface LoginAudit {
  id: number
  ip_address: string | null
  user_agent: string | null
  successful: boolean
  failure_reason: string | null
  signed_in_at: string | null
  signed_out_at: string | null
  is_current_session: boolean
}

export interface TwoFactorStatus {
  enabled: boolean
  confirmed_at: string | null
}

export interface TwoFactorEnableResponse {
  message: string
  confirmed_at: string | null
}

export interface TwoFactorDisableResponse {
  message: string
}

export interface RevokeAllSessionsResponse {
  message: string
  revoked_count: number
}

export const updatePasswordInputSchema = z
  .object({
    current_password: z.string().min(1, "Enter your current password"),
    password: z
      .string()
      .min(12, "Use at least 12 characters")
      .max(255)
      .regex(/[a-z]/, "Add a lowercase letter")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[0-9]/, "Add a number")
      .regex(/[^A-Za-z0-9]/, "Add a symbol"),
    password_confirmation: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  })

export type UpdatePasswordInput = z.infer<typeof updatePasswordInputSchema>

export const requestAccountDeletionInputSchema = z.object({
  password: z.string().min(1, "Enter your password to confirm"),
  reason: z.string().max(1000).optional(),
})

export type RequestAccountDeletionInput = z.infer<
  typeof requestAccountDeletionInputSchema
>

export interface DataExportRequest {
  id: number | null
  status: "none" | "queued" | "processing" | "ready" | "failed" | "expired"
  download_url: string | null
  ready_at: string | null
  expires_at: string | null
  created_at: string | null
}

export interface AccountDeletionRequest {
  id: number | null
  status: "none" | "pending" | "cancelled" | "completed"
  scheduled_for: string | null
  reason: string | null
  cancelled_at: string | null
  completed_at: string | null
  grace_days: number
}
