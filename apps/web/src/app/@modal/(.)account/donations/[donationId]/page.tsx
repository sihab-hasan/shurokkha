"use client"

import { useParams, useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shurokkha/ui/components/dialog"

import { DonationDetail } from "@/features/donations"

export default function InterceptedDonationModal() {
  const router = useRouter()
  const { donationId } = useParams<{ donationId: string }>()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Donation receipt details</DialogTitle>
        </DialogHeader>
        <DonationDetail id={donationId} />
      </DialogContent>
    </Dialog>
  )
}
