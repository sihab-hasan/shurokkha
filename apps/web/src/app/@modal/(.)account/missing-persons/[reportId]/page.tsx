"use client"

import { useParams, useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shurokkha/ui/components/dialog"
import { MissingPersonDetail } from "@/features/missing-persons"

export default function InterceptedMissingPersonModal() {
  const router = useRouter()
  const { reportId } = useParams<{ reportId: string }>()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Missing-person report details</DialogTitle>
        </DialogHeader>
        <MissingPersonDetail id={reportId} />
      </DialogContent>
    </Dialog>
  )
}
