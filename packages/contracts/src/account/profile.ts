import { z } from "zod"

export const LOCATION_SHARING = ["never", "while_using", "always"] as const
export type LocationSharing = (typeof LOCATION_SHARING)[number]

export const PROFILE_VISIBILITY = ["public", "helpers", "private"] as const
export type ProfileVisibility = (typeof PROFILE_VISIBILITY)[number]

export const DIGEST_CADENCE = ["never", "daily", "weekly"] as const
export type DigestCadence = (typeof DIGEST_CADENCE)[number]

export const NOTIFICATION_CHANNELS = ["email", "sms", "push"] as const
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number]

export const NOTIFICATION_EVENT_KEYS = [
  "assistance_update",
  "donation_receipt",
  "emergency_alert",
  "weekly_digest",
] as const
export type NotificationEventKey = (typeof NOTIFICATION_EVENT_KEYS)[number]

export interface Profile {
  id: number
  full_name: string
  email: string
  email_verified_at: string | null
  phone: string | null
  phone_verified_at: string | null
  avatar_url: string | null
  timezone: string
  two_factor_confirmed_at: string | null
  updated_at: string | null
}

export interface ProfileInput {
  full_name: string
  email: string
  phone: string | null
  timezone: string
}

export interface NotificationPreferences {
  email_enabled: boolean
  sms_enabled: boolean
  push_enabled: boolean
  quiet_hours_start: string | null
  quiet_hours_end: string | null
  digest_cadence: DigestCadence
  preferences: Partial<Record<NotificationEventKey, NotificationChannel[]>>
  updated_at: string | null
}

export interface NotificationPreferencesInput {
  email_enabled: boolean
  sms_enabled: boolean
  push_enabled: boolean
  quiet_hours_start: string | null
  quiet_hours_end: string | null
  digest_cadence: DigestCadence
  preferences: Partial<Record<NotificationEventKey, NotificationChannel[]>>
}

export interface PrivacyPreferences {
  location_sharing: LocationSharing
  profile_visibility: ProfileVisibility
  anonymous_donations: boolean
  data_export_requested_at: string | null
  account_deletion_requested_at: string | null
  updated_at: string | null
}

export interface PrivacyPreferencesInput {
  location_sharing: LocationSharing
  profile_visibility: ProfileVisibility
  anonymous_donations: boolean
}

export const profileInputSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .max(20)
    .nullable()
    .or(z.literal("").transform(() => null)),
  timezone: z.string().trim().min(1).max(64),
})

export const notificationPreferencesInputSchema = z.object({
  email_enabled: z.boolean(),
  sms_enabled: z.boolean(),
  push_enabled: z.boolean(),
  quiet_hours_start: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM (24h) format")
    .nullable()
    .or(z.literal("").transform(() => null)),
  quiet_hours_end: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM (24h) format")
    .nullable()
    .or(z.literal("").transform(() => null)),
  digest_cadence: z.enum(DIGEST_CADENCE),
  preferences: z
    .record(z.string(), z.array(z.enum(NOTIFICATION_CHANNELS)))
    .default({}),
})

export const privacyPreferencesInputSchema = z.object({
  location_sharing: z.enum(LOCATION_SHARING),
  profile_visibility: z.enum(PROFILE_VISIBILITY),
  anonymous_donations: z.boolean(),
})
