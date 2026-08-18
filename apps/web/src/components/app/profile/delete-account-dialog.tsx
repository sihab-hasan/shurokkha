"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@shurokkha/ui/components/alert-dialog"
import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { routes } from "@/config/routes"

interface DeleteAccountDialogProps {
  username: string
  onDelete: () => void
  trigger?: React.ReactNode
}

export function DeleteAccountDialog({
  username,
  onDelete,
  trigger,
}: DeleteAccountDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [confirmationInput, setConfirmationInput] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)

  const isConfirmed =
    confirmationInput.trim().toLowerCase() === username.toLowerCase() ||
    confirmationInput.trim().toUpperCase() === "DELETE"

  const handleDelete = () => {
    if (!isConfirmed) return

    setIsDeleting(true)
    setTimeout(() => {
      onDelete()
      setOpen(false)
      setIsDeleting(false)
      router.push(routes.auth.signOut)
    }, 500)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="size-4" />
              <span>Delete account</span>
            </Button>
          )
        }
      />

      <AlertDialogContent size="default" className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-danger/10 text-danger">
            <AlertTriangle className="size-5" />
          </div>
          <AlertDialogTitle className="text-lg font-semibold text-danger">
            Permanently delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
            This action cannot be undone. All your profile details, household
            records, emergency contact associations, and active emergency
            requests will be permanently removed from the Shurokkha system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-2 space-y-2 rounded-lg border border-border bg-muted/40 p-3">
          <Label htmlFor="delete-confirm-input" className="text-xs font-medium">
            Type{" "}
            <span className="font-mono font-bold text-foreground">
              {username}
            </span>{" "}
            or{" "}
            <span className="font-mono font-bold text-foreground">DELETE</span>{" "}
            to confirm:
          </Label>
          <Input
            id="delete-confirm-input"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={username}
            className="font-mono text-sm"
            autoComplete="off"
          />
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel
            render={
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmationInput("")
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
            }
          />
          <AlertDialogAction
            render={
              <Button
                variant="destructive"
                disabled={!isConfirmed || isDeleting}
                onClick={handleDelete}
                className="gap-2"
              >
                <Trash2 className="size-4" />
                <span>{isDeleting ? "Deleting..." : "Permanently delete"}</span>
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
