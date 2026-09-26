"use client"

import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shurokkha/ui/components/dialog"

import { MissingPersonForm } from "@/features/missing-persons"

export default function NewMissingPersonReportModal() {
  const router = useRouter()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Report a missing person</DialogTitle>
        </DialogHeader>
        <MissingPersonForm
          embedded
          onCancel={() => router.back()}
          onSaved={() => router.back()}
        />
      </DialogContent>
    </Dialog>
  )
}
