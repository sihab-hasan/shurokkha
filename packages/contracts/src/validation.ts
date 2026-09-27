import { z } from "zod"

import { DONATION_KINDS, DONATION_PAYMENT_METHODS } from "./donation"

export const idSchema = z.string().min(1)

export const assistanceRequestTypeSchema = z.enum([
  "rescue",
  "medical",
  "essentials",
  "shelter",
  "other",
])

export const assistanceRequestPrioritySchema = z.enum([
  "critical",
  "high",
  "normal",
])

export const assistanceRequestInputSchema = z.object({
  type: assistanceRequestTypeSchema,
  priority: assistanceRequestPrioritySchema,
  description: z.string().trim().min(10).max(3000),
  affected_people_count: z.coerce.number().int().min(1).max(10000),
  contact_phone: z.string().trim().min(5).max(32),
  address: z.string().trim().min(5).max(500),
})

export const missingPersonGenderSchema = z.enum([
  "female",
  "male",
  "other",
  "unknown",
])

export const missingPersonInputSchema = z
  .object({
    full_name: z.string().trim().min(2).max(160),
    age: z.coerce.number().int().min(0).max(130).nullable().optional(),
    gender: missingPersonGenderSchema.nullable().optional(),
    physical_description: z.string().trim().max(3000).nullable().optional(),
    distinguishing_features: z.string().trim().max(2000).nullable().optional(),
    last_seen_at: z.string().min(1, "Last seen date and time are required."),
    last_seen_location: z.string().trim().min(3).max(500),
    latitude: z.coerce.number().min(-90).max(90).nullable().optional(),
    longitude: z.coerce.number().min(-180).max(180).nullable().optional(),
    contact_phone: z.string().trim().min(5).max(32),
  })
  .superRefine((value, context) => {
    if ((value.latitude == null) !== (value.longitude == null)) {
      context.addIssue({
        code: "custom",
        path: [value.latitude == null ? "latitude" : "longitude"],
        message: "Latitude and longitude must be provided together.",
      })
    }
  })

/**
 * Validation for `POST /v1/donations`.
 *
 * Mirrors `StoreDonationRequest`:
 *  - `donation_kind` ∈ {@link DONATION_KINDS}, required
 *  - `amount` ≥ 1, ≤ 99_999_999.99
 *  - `payment_method` optional, must be in {@link DONATION_PAYMENT_METHODS}
 *  - `campaign_title` optional, ≤ 255 chars
 *  - `currency` optional, ISO-4217 3-letter code (default "BDT"
 *    enforced server-side; we default here too so the form is honest)
 */
export const donationInputSchema = z.object({
  donation_kind: z.enum(DONATION_KINDS),
  amount: z.coerce.number().min(1).max(99_999_999.99),
  payment_method: z
    .enum(DONATION_PAYMENT_METHODS)
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
  campaign_title: z
    .string()
    .trim()
    .max(255)
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
  currency: z.string().trim().length(3).default("BDT"),
})

export type DonationInputValues = z.infer<typeof donationInputSchema>
