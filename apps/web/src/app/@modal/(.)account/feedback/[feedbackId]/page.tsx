"use client"

import { useParams, useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shurokkha/ui/components/dialog"

import { FeedbackDetailClient } from "@/features/account-lifecycle/components/feedback-detail-client"

export default function InterceptedFeedbackModal() {
  const router = useRouter()
  const { feedbackId } = useParams<{ feedbackId: string }>()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Feedback details</DialogTitle>
        </DialogHeader>
        <FeedbackDetailClient id={feedbackId} />
      </DialogContent>
    </Dialog>
  )
}
