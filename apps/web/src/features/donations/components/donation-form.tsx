"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import type {
  DonationKind,
  DonationPaymentMethod,
  DonationRecord,
} from "@shurokkha/contracts"
import {
  DONATION_KINDS,
  DONATION_PAYMENT_METHODS,
  donationInputSchema,
} from "@shurokkha/contracts"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"
import {
  FieldGroup,
  FormActions,
  FormGrid,
  FormSection,
  ValidationSummary,
  type ValidationIssue,
} from "@shurokkha/ui/components/misc"
import { toast } from "@shurokkha/ui/components/sonner"

import { routes } from "@/config/routes"
import { errorMessage, issuesFromError } from "@/features/shared/api-feedback"
import { titleCase } from "@/features/shared/formatters"

import { useCreateDonation } from "../hooks/use-create-donation"

/**
 * Public-facing donation form.
 *
 * Mounts on `/donate` (the marketing-style landing route) so a
 * would-be donor can pick a campaign / kind, enter an amount, choose
 * a payment method, and submit. We currently don't do real payment
 * capture — the backend stamps the donation `pending` and routes it
 * to the coordination team.
 *
 * The endpoint requires an authenticated user (`auth` middleware +
 * `DonationPolicy::create`). Guests see a CTA pointing to sign-in
 * instead of a broken form.
 */
export function DonationForm() {
  const router = useRouter()
  const create = useCreateDonation()

  const [kind, setKind] = React.useState<DonationKind>("one_time")
  const [amount, setAmount] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState<
    DonationPaymentMethod | ""
  >("")
  const [campaignTitle, setCampaignTitle] = React.useState("")
  const [issues, setIssues] = React.useState<ValidationIssue[]>([])
  const [message, setMessage] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIssues([])
    setMessage(null)

    const parsed = donationInputSchema.safeParse({
      donation_kind: kind,
      amount,
      payment_method: paymentMethod === "" ? null : paymentMethod,
      campaign_title: campaignTitle.trim() || null,
      currency: "BDT",
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

    try {
      const record: DonationRecord = await create.mutateAsync(parsed.data)
      // After a successful submission, send the donor to the receipt on
      // their account page. Cancel any in-flight validation issues first
      // so the route render starts clean.
      setIssues([])
      setMessage(null)
      toast.success("Thanks — your donation has been recorded.")
      router.push(routes.account.donation(String(record.donation_id)))
    } catch (error) {
      const apiIssues = issuesFromError(error)
      if (apiIssues.length) setIssues(apiIssues)
      else
        setMessage(
          errorMessage(
            error,
            "We couldn't record your donation. Please try again in a moment."
          )
        )
    }
  }

  const isSaving = create.isPending

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <ValidationSummary issues={issues} />
      {message ? (
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      <FormSection title="What you're donating">
        <FormGrid>
          <FieldGroup
            label={<Label htmlFor="donation-kind">Donation type</Label>}
            required
          >
            <NativeSelect
              id="donation-kind"
              className="w-full"
              value={kind}
              onChange={(event) => setKind(event.target.value as DonationKind)}
              disabled={isSaving}
            >
              {DONATION_KINDS.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {titleCase(value)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FieldGroup>

          <FieldGroup
            label={<Label htmlFor="donation-amount">Amount (BDT)</Label>}
            required
          >
            <Input
              id="donation-amount"
              type="number"
              inputMode="decimal"
              min={1}
              max={99999999.99}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="e.g. 1000"
              disabled={isSaving}
            />
          </FieldGroup>

          <FieldGroup
            className="md:col-span-2"
            label={<Label htmlFor="donation-campaign">Campaign</Label>}
          >
            <Input
              id="donation-campaign"
              value={campaignTitle}
              onChange={(event) => setCampaignTitle(event.target.value)}
              placeholder="e.g. Sylhet Flood Relief Fund 2026 (leave blank for general fund)"
              maxLength={255}
              disabled={isSaving}
            />
          </FieldGroup>
        </FormGrid>
      </FormSection>

      <FormSection title="How you'd like to pay">
        <FormGrid>
          <FieldGroup
            label={<Label htmlFor="donation-method">Payment method</Label>}
          >
            <NativeSelect
              id="donation-method"
              className="w-full"
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(
                  event.target.value as DonationPaymentMethod | ""
                )
              }
              disabled={isSaving}
            >
              <NativeSelectOption value="">Decide later</NativeSelectOption>
              {DONATION_PAYMENT_METHODS.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {titleCase(value)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FieldGroup>
        </FormGrid>
      </FormSection>

      <FormActions>
        <Button type="submit" disabled={isSaving || amount.trim() === ""}>
          {isSaving ? "Submitting…" : "Submit donation"}
        </Button>
      </FormActions>
    </form>
  )
}
