"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { DonationInput, DonationRecord } from "@shurokkha/contracts"

import { toast } from "@shurokkha/ui/components/sonner"

import { errorMessage } from "@/features/shared/api-feedback"
import { getShurokkhaApi } from "@/lib/api"

/**
 * Mutation for `POST /v1/donations`.
 *
 * On success, invalidates every donations list page + the stats bucket
 * so the citizen account page reflects the new receipt on next render.
 * The server stamps `status=pending` and assigns a receipt number —
 * the response is the full `DonationRecord`.
 */
export function useCreateDonation() {
  const queryClient = useQueryClient()

  return useMutation<DonationRecord, Error, DonationInput>({
    mutationFn: async (input) => {
      const response = await getShurokkhaApi().resources.donations.create(input)
      return response.data
    },
    onSuccess: (record) => {
      void queryClient.invalidateQueries({ queryKey: ["donations", "list"] })
      void queryClient.invalidateQueries({ queryKey: ["donations", "stats"] })
      toast.success(
        `Donation submitted — receipt ${record.receipt_number ?? record.donation_id}.`
      )
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not submit your donation."))
    },
  })
}
