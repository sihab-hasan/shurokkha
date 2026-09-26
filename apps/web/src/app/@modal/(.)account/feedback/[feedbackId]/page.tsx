"use client"

import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shurokkha/ui/components/dialog"

export default function InterceptedFeedbackModal({
  params,
}: {
  params: { feedbackId: string }
}) {
  const router = useRouter()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Feedback Thread #{params.feedbackId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="flex justify-between border-b pb-2 text-sm">
            <span className="font-medium text-muted-foreground">
              Feedback ID
            </span>
            <span className="font-semibold">{params.feedbackId}</span>
          </div>
          <div className="flex justify-between border-b pb-2 text-sm">
            <span className="font-medium text-muted-foreground">Category</span>
            <span>Relief Distribution Quality</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
