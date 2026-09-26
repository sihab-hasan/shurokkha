"use client"

import { useParams, useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shurokkha/ui/components/dialog"
import { AssistanceRequestDetail } from "@/features/assistance"

export default function InterceptedAssistanceModal() {
  const router = useRouter()
  const { requestId } = useParams<{ requestId: string }>()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Assistance request details</DialogTitle>
        </DialogHeader>
        <AssistanceRequestDetail id={requestId} />
      </DialogContent>
    </Dialog>
  )
}
