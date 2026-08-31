import { z } from "zod"

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
