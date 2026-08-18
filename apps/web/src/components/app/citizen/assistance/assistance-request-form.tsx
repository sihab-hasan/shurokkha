"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LocateFixed } from "lucide-react"

import type {
  AssistanceRequestInput,
  AssistanceRequestRecord,
  AssistanceRequestPriority,
  AssistanceRequestType,
} from "@shurokkha/contracts"
import { assistanceRequestInputSchema } from "@shurokkha/validation"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Button } from "@shurokkha/ui/components/button"
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

import { getShurokkhaApi } from "@/lib/api"
import {
  errorMessage,
  issuesFromError,
} from "@/components/app/citizen/api-feedback"

interface AssistanceRequestFormProps {
  initial?: AssistanceRequestRecord
  embedded?: boolean
  onSaved?: (record: AssistanceRequestRecord) => void
  onCancel?: () => void
}

export function AssistanceRequestForm({
  initial,
  embedded = false,
  onSaved,
  onCancel,
}: AssistanceRequestFormProps) {
  const router = useRouter()
  const [type, setType] = useState<AssistanceRequestType>(
    initial?.type ?? "medical"
  )
  const [priority, setPriority] = useState<AssistanceRequestPriority>(
    initial?.priority ?? "high"
  )
  const [description, setDescription] = useState(initial?.description ?? "")
  const [affectedPeople, setAffectedPeople] = useState(
    String(initial?.affected_people_count ?? 1)
  )
  const [contactPhone, setContactPhone] = useState(initial?.contact_phone ?? "")
  const [address, setAddress] = useState(initial?.address ?? "")
  const [latitude, setLatitude] = useState(
    initial?.latitude == null ? "" : String(initial.latitude)
  )
  const [longitude, setLongitude] = useState(
    initial?.longitude == null ? "" : String(initial.longitude)
  )
  const [issues, setIssues] = useState<ValidationIssue[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setMessage("Location access is not supported by this browser.")
      return
    }

    setIsLocating(true)
    setMessage(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(7))
        setLongitude(position.coords.longitude.toFixed(7))
        setIsLocating(false)
      },
      () => {
        setMessage(
          "We could not read your location. Enter it manually or allow location access."
        )
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIssues([])
    setMessage(null)

    const candidate = {
      type,
      priority,
      description,
      affected_people_count: affectedPeople,
      contact_phone: contactPhone,
      address,
      latitude: latitude === "" ? null : latitude,
      longitude: longitude === "" ? null : longitude,
    }

    const parsed = assistanceRequestInputSchema.safeParse(candidate)
    if (!parsed.success) {
      setIssues(
        parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      )
      return
    }

    setIsSaving(true)
    try {
      const api = getShurokkhaApi()
      const response = initial
        ? await api.citizen.assistanceRequests.update(
            initial.id,
            parsed.data as AssistanceRequestInput
          )
        : await api.citizen.assistanceRequests.create(
            parsed.data as AssistanceRequestInput
          )

      onSaved?.(response.data)
      if (!initial) router.push(`/citizen/requests/${response.data.id}`)
    } catch (error) {
      const apiIssues = issuesFromError(error)
      if (apiIssues.length) setIssues(apiIssues)
      else
        setMessage(
          errorMessage(error, "The assistance request could not be saved.")
        )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {!embedded ? (
        <PageHeader
          title="Request emergency help"
          description="Tell responders what you need, who is affected, and where help is required."
        />
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <ValidationSummary issues={issues} />
        {message ? (
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <FormSection
          title="Assistance details"
          description="Choose the closest category and urgency for the current situation."
        >
          <FormGrid>
            <FieldGroup
              label={<Label htmlFor="request-type">Assistance type</Label>}
              required
            >
              <NativeSelect
                id="request-type"
                className="w-full"
                value={type}
                onChange={(event) =>
                  setType(event.target.value as AssistanceRequestType)
                }
                disabled={isSaving}
              >
                <NativeSelectOption value="rescue">
                  Rescue / evacuation
                </NativeSelectOption>
                <NativeSelectOption value="medical">
                  Medical emergency
                </NativeSelectOption>
                <NativeSelectOption value="essentials">
                  Food, water, or medicine
                </NativeSelectOption>
                <NativeSelectOption value="shelter">
                  Temporary shelter
                </NativeSelectOption>
                <NativeSelectOption value="other">
                  Other urgent help
                </NativeSelectOption>
              </NativeSelect>
            </FieldGroup>

            <FieldGroup
              label={<Label htmlFor="request-priority">Priority</Label>}
              required
            >
              <NativeSelect
                id="request-priority"
                className="w-full"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as AssistanceRequestPriority)
                }
                disabled={isSaving}
              >
                <NativeSelectOption value="critical">
                  Critical
                </NativeSelectOption>
                <NativeSelectOption value="high">High</NativeSelectOption>
                <NativeSelectOption value="normal">Normal</NativeSelectOption>
              </NativeSelect>
            </FieldGroup>

            <FieldGroup
              className="md:col-span-2"
              label={
                <Label htmlFor="request-description">What happened?</Label>
              }
              description="Include hazards, injuries, access problems, and what responders should know."
              required
            >
              <Textarea
                id="request-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                maxLength={3000}
                disabled={isSaving}
              />
            </FieldGroup>

            <FieldGroup
              label={<Label htmlFor="affected-people">People affected</Label>}
              required
            >
              <Input
                id="affected-people"
                type="number"
                min={1}
                max={10000}
                value={affectedPeople}
                onChange={(event) => setAffectedPeople(event.target.value)}
                disabled={isSaving}
              />
            </FieldGroup>

            <FieldGroup
              label={<Label htmlFor="contact-phone">Contact phone</Label>}
              required
            >
              <Input
                id="contact-phone"
                type="tel"
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
                maxLength={32}
                disabled={isSaving}
              />
            </FieldGroup>
          </FormGrid>
        </FormSection>

        <FormSection
          title="Location"
          description="A precise location helps a response team reach you faster."
          actions={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={useCurrentLocation}
              disabled={isSaving || isLocating}
            >
              <LocateFixed />
              {isLocating ? "Locating…" : "Use current location"}
            </Button>
          }
        >
          <FormGrid>
            <FieldGroup
              className="md:col-span-2"
              label={
                <Label htmlFor="request-address">Address / landmark</Label>
              }
              required
            >
              <Input
                id="request-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                maxLength={500}
                placeholder="Road, village, shelter, landmark, or nearby facility"
                disabled={isSaving}
              />
            </FieldGroup>
            <FieldGroup
              label={<Label htmlFor="request-latitude">Latitude</Label>}
            >
              <Input
                id="request-latitude"
                inputMode="decimal"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                placeholder="23.8103000"
                disabled={isSaving}
              />
            </FieldGroup>
            <FieldGroup
              label={<Label htmlFor="request-longitude">Longitude</Label>}
            >
              <Input
                id="request-longitude"
                inputMode="decimal"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                placeholder="90.4125000"
                disabled={isSaving}
              />
            </FieldGroup>
          </FormGrid>
        </FormSection>

        <FormActions onSecondary={onCancel} secondaryLabel="Cancel">
          <Button type="submit" disabled={isSaving}>
            {isSaving
              ? initial
                ? "Saving…"
                : "Submitting…"
              : initial
                ? "Save changes"
                : "Submit request"}
          </Button>
        </FormActions>
      </form>
    </div>
  )
}
