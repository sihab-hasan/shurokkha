"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type {
  AssistanceRequestInput,
  AssistanceRequestRecord,
  AssistanceRequestPriority,
  AssistanceRequestType,
} from "@shurokkha/contracts"
import { assistanceRequestInputSchema } from "@shurokkha/contracts"
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
} from "@shurokkha/ui/components/misc"

import { routes } from "@/config/routes"
import { errorMessage, issuesFromError } from "@/features/shared/api-feedback"

import { useCreateAssistance } from "../hooks/use-create-assistance"
import { useUpdateAssistance } from "../hooks/use-update-assistance"

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
  const [issues, setIssues] = useState<ValidationIssue[]>([])
  const [message, setMessage] = useState<string | null>(null)

  const createMutation = useCreateAssistance()
  const updateMutation = useUpdateAssistance()

  const isSaving = createMutation.isPending || updateMutation.isPending

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

    try {
      const record = initial
        ? await updateMutation.mutateAsync({
            id: initial.id,
            input: parsed.data as Partial<AssistanceRequestInput>,
          })
        : await createMutation.mutateAsync(
            parsed.data as AssistanceRequestInput
          )

      onSaved?.(record)
      if (!initial) router.push(routes.account.assistanceRequest(record.id))
    } catch (error) {
      const apiIssues = issuesFromError(error)
      if (apiIssues.length) setIssues(apiIssues)
      else
        setMessage(
          errorMessage(error, "The assistance request could not be saved.")
        )
    }
  }

  return (
    <div className="space-y-6">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <ValidationSummary issues={issues} />
        {message ? (
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <FormSection title="Assistance details">
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

        <FormSection title="Location">
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
                placeholder="Address or landmark"
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
