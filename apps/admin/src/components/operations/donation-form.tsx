"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"

import { DONATION_KINDS, DONATION_PAYMENT_METHODS } from "@shurokkha/contracts"

import { adminRoutes } from "@/config/routes"
import { useDonations } from "@/hooks/operations/use-donations"
import type {
  DonationKind,
  DonationPaymentMethod,
} from "@/hooks/operations/types"

export function DonationForm() {
  const router = useRouter()
  const { create } = useDonations()

  const [donationKind, setDonationKind] = useState<DonationKind>("one_time")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("BDT")
  const [campaignTitle, setCampaignTitle] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<
    DonationPaymentMethod | ""
  >("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return
    create.mutate(
      {
        donation_kind: donationKind,
        amount: Number(amount),
        currency,
        campaign_title: campaignTitle || null,
        payment_method: paymentMethod || null,
      },
      {
        onSuccess: () => {
          setAmount("")
          setCampaignTitle("")
          router.push(adminRoutes.operations.donations.list)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="donation_kind">Kind *</Label>
          <NativeSelect
            id="donation_kind"
            value={donationKind}
            onChange={(e) => setDonationKind(e.target.value as DonationKind)}
          >
            {DONATION_KINDS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="500"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            maxLength={3}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="payment_method">Payment Method</Label>
          <NativeSelect
            id="payment_method"
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value as DonationPaymentMethod | "")
            }
          >
            <option value="">— None —</option>
            {DONATION_PAYMENT_METHODS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="campaign_title">Campaign Title</Label>
        <Input
          id="campaign_title"
          value={campaignTitle}
          onChange={(e) => setCampaignTitle(e.target.value)}
          placeholder="Sylhet Flood Relief Fund 2026"
        />
      </div>

      <Button type="submit" className="w-full" disabled={create.isPending}>
        {create.isPending ? "Recording…" : "Record Donation"}
      </Button>
    </form>
  )
}
