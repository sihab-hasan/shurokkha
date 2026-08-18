"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, LocateFixed, X } from "lucide-react"

import type {
  MissingPersonGender,
  MissingPersonReportInput,
  MissingPersonReportRecord,
} from "@shurokkha/contracts"
import { missingPersonInputSchema } from "@shurokkha/validation"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Button } from "@shurokkha/ui/components/button"
import { Checkbox } from "@shurokkha/ui/components/checkbox"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"
import { Textarea } from "@shurokkha/ui/components/textarea"
import {
  FieldGroup,
  FormActions,
  FormGrid,
  FormSection,
  ValidationSummary,
  type ValidationIssue,
} from "@shurokkha/ui-patterns/forms"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"

import {
  errorMessage,
  issuesFromError,
} from "@/components/app/citizen/api-feedback"
import {
  fromDateTimeLocalToIso,
  toDateTimeLocal,
} from "@/components/app/citizen/formatters"
import { routes } from "@/config/routes"
import { getShurokkhaApi } from "@/lib/api"

interface MissingPersonFormProps {
  initial?: MissingPersonReportRecord
  embedded?: boolean
  onSaved?: (record: MissingPersonReportRecord) => void
  onCancel?: () => void
}

const acceptedPhotoTypes = ["image/jpeg", "image/png", "image/webp"]
const maxPhotoSize = 5 * 1024 * 1024

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MissingPersonForm({
  initial,
  embedded = false,
  onSaved,
  onCancel,
}: MissingPersonFormProps) {
  const router = useRouter()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [fullName, setFullName] = useState(initial?.full_name ?? "")
  const [age, setAge] = useState(
    initial?.age == null ? "" : String(initial.age)
  )
  const [gender, setGender] = useState<"" | MissingPersonGender>(
    initial?.gender ?? ""
  )
  const [photo, setPhoto] = useState<File | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [physicalDescription, setPhysicalDescription] = useState(
    initial?.physical_description ?? ""
  )
  const [distinguishingFeatures, setDistinguishingFeatures] = useState(
    initial?.distinguishing_features ?? ""
  )
  const [lastSeenAt, setLastSeenAt] = useState(
    toDateTimeLocal(initial?.last_seen_at)
  )
  const [lastSeenLocation, setLastSeenLocation] = useState(
    initial?.last_seen_location ?? ""
  )
  const [latitude, setLatitude] = useState(
    initial?.latitude == null ? "" : String(initial.latitude)
  )
  const [longitude, setLongitude] = useState(
    initial?.longitude == null ? "" : String(initial.longitude)
  )
  const [contactPhone, setContactPhone] = useState(initial?.contact_phone ?? "")
  const [issues, setIssues] = useState<ValidationIssue[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)

  const fieldError = (field: string) =>
    issues.find((issue) => issue.field === field)?.message

  function clearSelectedPhoto() {
    setPhoto(null)
    if (photoInputRef.current) photoInputRef.current.value = ""
  }

  function handleCancel() {
    if (onCancel) {
      onCancel()
      return
    }

    if (initial) {
      router.push(routes.citizen.missingPerson(initial.id))
      return
    }

    router.push(routes.citizen.missingPersons)
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setMessage("Location access is not supported by this browser.")
      return
    }
    setLocating(true)
    setMessage(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(7))
        setLongitude(position.coords.longitude.toFixed(7))
        setLocating(false)
      },
      () => {
        setMessage(
          "Unable to read your location. Enter coordinates manually if available."
        )
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIssues([])
    setMessage(null)

    if (photo && !acceptedPhotoTypes.includes(photo.type)) {
      setIssues([
        { field: "photo", message: "Photo must be a JPG, PNG, or WebP image." },
      ])
      return
    }

    if (photo && photo.size > maxPhotoSize) {
      setIssues([{ field: "photo", message: "Photo must be 5 MB or smaller." }])
      return
    }

    const parsed = missingPersonInputSchema.safeParse({
      full_name: fullName,
      age: age === "" ? null : age,
      gender: gender === "" ? null : gender,
      physical_description: physicalDescription || null,
      distinguishing_features: distinguishingFeatures || null,
      last_seen_at: lastSeenAt,
      last_seen_location: lastSeenLocation,
      latitude: latitude === "" ? null : latitude,
      longitude: longitude === "" ? null : longitude,
      contact_phone: contactPhone,
    })

    if (!parsed.success) {
      setIssues(
        parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      )
      return
    }

    const input: MissingPersonReportInput = {
      ...(parsed.data as MissingPersonReportInput),
      last_seen_at: fromDateTimeLocalToIso(parsed.data.last_seen_at),
    }

    setSaving(true)
    try {
      const api = getShurokkhaApi()
      const response = initial
        ? await api.citizen.missingPersons.update(initial.id, input, {
            photo,
            removePhoto,
          })
        : await api.citizen.missingPersons.create(input, photo)

      onSaved?.(response.data)
      if (!initial) router.push(routes.citizen.missingPerson(response.data.id))
    } catch (error) {
      const apiIssues = issuesFromError(error)
      if (apiIssues.length) setIssues(apiIssues)
      else
        setMessage(
          errorMessage(error, "The missing-person report could not be saved.")
        )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {!embedded ? (
        <PageHeader
          title="Report a missing person"
          description="Provide the most accurate information you have so authorized responders can act on the report."
        />
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <ValidationSummary issues={issues} />
        {message ? (
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <FormSection
          compact
          title="Person details"
          description="Add identification details and a recent photo when available."
        >
          <FormGrid columns={4}>
            <FieldGroup
              className="md:col-span-2 xl:col-span-2"
              label={<Label htmlFor="missing-name">Full name</Label>}
              required
              error={fieldError("full_name")}
            >
              <Input
                id="missing-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                maxLength={160}
                placeholder="Person's full or commonly known name"
                autoComplete="name"
                aria-invalid={Boolean(fieldError("full_name"))}
                disabled={saving}
              />
            </FieldGroup>

            <FieldGroup
              label={<Label htmlFor="missing-age">Age</Label>}
              description="Approximate is okay."
              error={fieldError("age")}
            >
              <Input
                id="missing-age"
                type="number"
                min={0}
                max={130}
                value={age}
                onChange={(event) => setAge(event.target.value)}
                placeholder="e.g. 32"
                aria-invalid={Boolean(fieldError("age"))}
                disabled={saving}
              />
            </FieldGroup>

            <FieldGroup
              label={<Label htmlFor="missing-gender">Gender</Label>}
              error={fieldError("gender")}
            >
              <NativeSelect
                id="missing-gender"
                className="w-full"
                value={gender}
                onChange={(event) =>
                  setGender(event.target.value as "" | MissingPersonGender)
                }
                aria-invalid={Boolean(fieldError("gender"))}
                disabled={saving}
              >
                <NativeSelectOption value="">Not specified</NativeSelectOption>
                <NativeSelectOption value="female">Female</NativeSelectOption>
                <NativeSelectOption value="male">Male</NativeSelectOption>
                <NativeSelectOption value="other">Other</NativeSelectOption>
                <NativeSelectOption value="unknown">Unknown</NativeSelectOption>
              </NativeSelect>
            </FieldGroup>

            <FieldGroup
              className="md:col-span-2 xl:col-span-4"
              label={<Label htmlFor="missing-photo">Recent photo</Label>}
              description="JPG, PNG, or WebP; maximum 5 MB. A clear, recent face photo works best."
              error={fieldError("photo")}
            >
              <input
                ref={photoInputRef}
                id="missing-photo"
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const nextPhoto = event.target.files?.[0] ?? null
                  setPhoto(nextPhoto)
                  if (nextPhoto) setRemovePhoto(false)
                }}
                disabled={saving}
              />

              <label
                htmlFor="missing-photo"
                className="group flex min-h-20 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 hover:border-primary/50 hover:bg-muted/40"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                  <ImagePlus className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {photo
                      ? photo.name
                      : initial?.has_photo && !removePhoto
                        ? "Current photo attached"
                        : "Choose a recent photo"}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {photo
                      ? `${formatFileSize(photo.size)} · Click to replace`
                      : initial?.has_photo && !removePhoto
                        ? "Click to replace the current photo"
                        : "Click to browse from your device"}
                  </span>
                </span>
                <span className="hidden shrink-0 rounded-md border bg-background px-3 py-2 text-xs font-medium text-foreground sm:inline-flex">
                  {photo || initial?.has_photo
                    ? "Change photo"
                    : "Choose photo"}
                </span>
              </label>

              {photo ? (
                <div className="flex items-center justify-between gap-3 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  <span className="min-w-0 truncate">
                    Selected: {photo.name}
                  </span>
                  <Button
                    type="button"
                    size="xs"
                    variant="ghost"
                    onClick={clearSelectedPhoto}
                    disabled={saving}
                  >
                    <X aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              ) : null}

              {initial?.has_photo ? (
                <div className="flex items-start gap-3 rounded-md border bg-background px-3 py-2.5">
                  <Checkbox
                    id="remove-current-photo"
                    checked={removePhoto}
                    onCheckedChange={(checked) => {
                      setRemovePhoto(checked)
                      if (checked) clearSelectedPhoto()
                    }}
                    disabled={saving}
                    className="mt-0.5"
                  />
                  <div className="min-w-0">
                    <Label
                      htmlFor="remove-current-photo"
                      className="text-sm font-normal"
                    >
                      Remove the currently attached photo
                    </Label>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      The existing photo will be removed when you save these
                      changes.
                    </p>
                  </div>
                </div>
              ) : null}
            </FieldGroup>

            <FieldGroup
              className="md:col-span-2 xl:col-span-2"
              label={
                <Label htmlFor="physical-description">
                  Physical description
                </Label>
              }
              description="Build, complexion, hair, eye color, height, or other visible details."
              error={fieldError("physical_description")}
            >
              <Textarea
                id="physical-description"
                rows={4}
                value={physicalDescription}
                onChange={(event) => setPhysicalDescription(event.target.value)}
                maxLength={3000}
                placeholder="Describe the person's appearance"
                aria-invalid={Boolean(fieldError("physical_description"))}
                disabled={saving}
              />
            </FieldGroup>

            <FieldGroup
              className="md:col-span-2 xl:col-span-2"
              label={
                <Label htmlFor="distinguishing-features">
                  Distinguishing features
                </Label>
              }
              description="Scars, clothing, mobility aids, tattoos, or other identifying details."
              error={fieldError("distinguishing_features")}
            >
              <Textarea
                id="distinguishing-features"
                rows={4}
                value={distinguishingFeatures}
                onChange={(event) =>
                  setDistinguishingFeatures(event.target.value)
                }
                maxLength={2000}
                placeholder="Add details that may help identification"
                aria-invalid={Boolean(fieldError("distinguishing_features"))}
                disabled={saving}
              />
            </FieldGroup>
          </FormGrid>
        </FormSection>

        <FormSection
          compact
          title="Last known information"
          description="Record when and where the person was last seen and how responders can contact you."
          actions={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={useCurrentLocation}
              disabled={saving || locating}
            >
              <LocateFixed aria-hidden="true" />
              {locating ? "Locating…" : "Use current location"}
            </Button>
          }
        >
          <FormGrid>
            <FieldGroup
              label={
                <Label htmlFor="last-seen-at">Last seen date & time</Label>
              }
              required
              error={fieldError("last_seen_at")}
            >
              <Input
                id="last-seen-at"
                type="datetime-local"
                value={lastSeenAt}
                onChange={(event) => setLastSeenAt(event.target.value)}
                max={toDateTimeLocal(new Date().toISOString())}
                aria-invalid={Boolean(fieldError("last_seen_at"))}
                disabled={saving}
              />
            </FieldGroup>

            <FieldGroup
              label={<Label htmlFor="missing-contact">Contact phone</Label>}
              required
              error={fieldError("contact_phone")}
            >
              <Input
                id="missing-contact"
                type="tel"
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
                maxLength={32}
                placeholder="e.g. +880 1XXXXXXXXX"
                autoComplete="tel"
                aria-invalid={Boolean(fieldError("contact_phone"))}
                disabled={saving}
              />
            </FieldGroup>

            <FieldGroup
              className="md:col-span-2"
              label={
                <Label htmlFor="last-seen-location">
                  Last seen location / landmark
                </Label>
              }
              description="Use a precise address, landmark, shelter, road, village, or facility name."
              required
              error={fieldError("last_seen_location")}
            >
              <Input
                id="last-seen-location"
                value={lastSeenLocation}
                onChange={(event) => setLastSeenLocation(event.target.value)}
                maxLength={500}
                placeholder="Where was the person last seen?"
                aria-invalid={Boolean(fieldError("last_seen_location"))}
                disabled={saving}
              />
            </FieldGroup>

            <FieldGroup
              label={<Label htmlFor="missing-latitude">Latitude</Label>}
              description="Optional"
              error={fieldError("latitude")}
            >
              <Input
                id="missing-latitude"
                inputMode="decimal"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                placeholder="23.8103000"
                aria-invalid={Boolean(fieldError("latitude"))}
                disabled={saving}
              />
            </FieldGroup>

            <FieldGroup
              label={<Label htmlFor="missing-longitude">Longitude</Label>}
              description="Optional"
              error={fieldError("longitude")}
            >
              <Input
                id="missing-longitude"
                inputMode="decimal"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                placeholder="90.4125000"
                aria-invalid={Boolean(fieldError("longitude"))}
                disabled={saving}
              />
            </FieldGroup>
          </FormGrid>
        </FormSection>

        <FormActions onSecondary={handleCancel} secondaryLabel="Cancel">
          <Button type="submit" disabled={saving}>
            {saving
              ? initial
                ? "Saving…"
                : "Submitting…"
              : initial
                ? "Save changes"
                : "Submit report"}
          </Button>
        </FormActions>
      </form>
    </div>
  )
}
