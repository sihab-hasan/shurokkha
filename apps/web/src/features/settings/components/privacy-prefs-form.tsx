"use client"

import * as React from "react"
import { Download, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shurokkha/ui/components/alert-dialog"
import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"
import { SettingsCard } from "@shurokkha/ui/components/settings-card"
import { SettingsRow } from "@shurokkha/ui/components/settings-row"
import { SettingsSection } from "@shurokkha/ui/components/settings-section"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { Switch } from "@shurokkha/ui/components/switch"
import { toast } from "@shurokkha/ui/components/sonner"

import {
  LOCATION_SHARING,
  PROFILE_VISIBILITY,
  requestAccountDeletionInputSchema,
  type LocationSharing,
  type PrivacyPreferencesInput,
  type ProfileVisibility,
} from "@shurokkha/contracts"

import {
  usePrivacyPrefs,
  useUpdatePrivacyPrefs,
} from "../hooks/use-privacy-prefs"
import {
  useAccountDeletionRequest,
  useCancelAccountDeletion,
  useRequestAccountDeletion,
} from "../hooks/use-account-deletion"
import {
  useDataExportRequest,
  useRequestDataExport,
} from "../hooks/use-data-export"
import { ApiFailure, errorMessage } from "@/features/shared/api-feedback"
import { timeAgo } from "@/features/shared/time-ago"
import { SaveBar } from "./save-bar"

const LOCATION_LABELS: Record<LocationSharing, string> = {
  never: "Never share",
  while_using: "Only while using the app",
  always: "Always share",
}

const VISIBILITY_LABELS: Record<ProfileVisibility, string> = {
  public: "Public — anyone with the link",
  helpers: "Helpers only — verified responders",
  private: "Private — only you",
}

export function PrivacyPrefsForm() {
  const { data, isPending, isError, error } = usePrivacyPrefs()
  const update = useUpdatePrivacyPrefs()

  const [location, setLocation] = React.useState<LocationSharing>("while_using")
  const [visibility, setVisibility] =
    React.useState<ProfileVisibility>("helpers")
  const [anonymous, setAnonymous] = React.useState(false)

  // Track the `updated_at` of the last server snapshot we've seeded
  // local state from, so a re-fetch doesn't clobber the user's edits.
  const [seededAt, setSeededAt] = React.useState<string | null>(null)
  const seededAtRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (data && seededAtRef.current !== String(data.updated_at)) {
      seededAtRef.current = String(data.updated_at)
      setSeededAt(String(data.updated_at))
    }
  }, [data])

  // The latest server-known values. Used as the pristine baseline for
  // dirty detection — any divergence between local state and `data`
  // means the user has unsaved edits.
  const pristine: {
    location: LocationSharing
    visibility: ProfileVisibility
    anonymous: boolean
  } | null =
    data && seededAt === String(data.updated_at)
      ? {
          location: data.location_sharing,
          visibility: data.profile_visibility,
          anonymous: data.anonymous_donations,
        }
      : null

  // Seed local state from the server snapshot once per `updated_at`.
  // We compare against `seededAt` (state) so React tracks the dependency
  // correctly without exposing the ref during render.
  React.useEffect(() => {
    if (!data || seededAt !== String(data.updated_at)) return
    setLocation(data.location_sharing)
    setVisibility(data.profile_visibility)
    setAnonymous(data.anonymous_donations)
  }, [data, seededAt])

  const dirty = pristine
    ? pristine.location !== location ||
      pristine.visibility !== visibility ||
      pristine.anonymous !== anonymous
    : false

  if (isPending) {
    return (
      <div className="space-y-8">
        <SettingsSection eyebrow="Sharing" title="Location" />
        <SettingsCard flush size="sm">
          {Array.from({ length: 1 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-9 w-48 rounded-md" />
            </div>
          ))}
        </SettingsCard>
      </div>
    )
  }

  if (isError) {
    return (
      <ApiFailure
        error={error}
        fallback="Could not load privacy preferences."
      />
    )
  }

  function onSubmit() {
    if (update.isPending) return
    const payload: PrivacyPreferencesInput = {
      location_sharing: location,
      profile_visibility: visibility,
      anonymous_donations: anonymous,
    }
    update.mutate(payload)
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <ApiFailure
        error={update.error}
        fallback="Could not save privacy preferences."
      />

      <section className="space-y-4">
        <SettingsSection
          eyebrow="Sharing"
          title="Location"
          description="Decide whether we share your location with verified rescue teams."
          metadata={<span>Updated {timeAgo(data?.updated_at)}</span>}
        />
        <SettingsCard flush size="sm">
          <SettingsRow
            label="Location sharing"
            description="Controls GPS access during emergency broadcasts."
            control={
              <NativeSelect
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value as LocationSharing)
                }
              >
                {LOCATION_SHARING.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {LOCATION_LABELS[value]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            }
          />
        </SettingsCard>
      </section>

      <section className="space-y-4">
        <SettingsSection
          eyebrow="Visibility"
          title="Profile"
          description="Choose who can see your public profile."
        />
        <SettingsCard flush size="sm">
          <SettingsRow
            label="Profile visibility"
            description="Affects campaign leaderboards and donor recognition."
            control={
              <NativeSelect
                value={visibility}
                onChange={(event) =>
                  setVisibility(event.target.value as ProfileVisibility)
                }
              >
                {PROFILE_VISIBILITY.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {VISIBILITY_LABELS[value]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            }
          />
        </SettingsCard>
      </section>

      <section className="space-y-4">
        <SettingsSection
          eyebrow="Donations"
          title="Recognition"
          description="Control how your name appears on donor leaderboards."
        />
        <SettingsCard flush size="sm">
          <SettingsRow
            id="privacy-anonymous"
            label="Anonymous donations"
            description="Hide your full name from public campaign donor lists."
            control={
              <Switch
                id="privacy-anonymous"
                checked={anonymous}
                onCheckedChange={(value) => setAnonymous(value)}
              />
            }
          />
        </SettingsCard>
      </section>

      <DangerZoneSection />

      <SaveBar
        disabled={!dirty}
        loading={update.isPending}
        label="Save preferences"
        onSave={onSubmit}
        left={
          dirty ? (
            <Badge
              variant="warning"
              className="font-mono text-[10px] tracking-wide uppercase"
            >
              Unsaved changes
            </Badge>
          ) : (
            <Badge
              variant="success"
              className="font-mono text-[10px] tracking-wide uppercase"
            >
              All saved
            </Badge>
          )
        }
      />
    </form>
  )
}

function DangerZoneSection() {
  const exportQuery = useDataExportRequest()
  const exportMut = useRequestDataExport()
  const deletionQuery = useAccountDeletionRequest()
  const deletionMut = useRequestAccountDeletion()
  const cancelDeletionMut = useCancelAccountDeletion()

  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [confirmErrors, setConfirmErrors] = React.useState<
    Partial<Record<"password" | "reason", string>>
  >({})

  const exportStatus = exportQuery.data?.status ?? "none"
  const deletionStatus = deletionQuery.data?.status ?? "none"
  const deletionScheduledFor = deletionQuery.data?.scheduled_for ?? null
  const exportDownloadUrl = exportQuery.data?.download_url ?? null
  const exportReadyAt = exportQuery.data?.ready_at ?? null

  function onRequestExport() {
    exportMut.mutate(undefined, {
      onSuccess: () =>
        toast.success("Export queued. We'll notify you when it's ready."),
      onError: (error) =>
        toast.error(errorMessage(error, "Could not request a data export.")),
    })
  }

  function openDeleteDialog() {
    setPassword("")
    setReason("")
    setConfirmErrors({})
    setConfirmOpen(true)
  }

  function onConfirmDelete() {
    if (deletionMut.isPending) return
    const parsed = requestAccountDeletionInputSchema.safeParse({
      password,
      reason: reason.trim() || undefined,
    })
    if (!parsed.success) {
      const next: typeof confirmErrors = {}
      for (const issue of parsed.error.issues) {
        const path = issue.path[0]
        if (path === "password" || path === "reason") next[path] = issue.message
      }
      setConfirmErrors(next)
      return
    }
    setConfirmErrors({})
    deletionMut.mutate(parsed.data, {
      onSuccess: () => {
        toast.success(
          "Account deletion scheduled. Cancel any time before the grace period ends."
        )
        setConfirmOpen(false)
      },
      onError: (error) =>
        toast.error(
          errorMessage(error, "Could not schedule account deletion.")
        ),
    })
  }

  function onCancelDeletion() {
    cancelDeletionMut.mutate(undefined, {
      onSuccess: () => toast.success("Account deletion cancelled."),
      onError: (error) =>
        toast.error(errorMessage(error, "Could not cancel account deletion.")),
    })
  }

  return (
    <section className="space-y-4">
      <SettingsSection
        eyebrow="Danger zone"
        title="Account data"
        description="Permanent actions that affect your account data."
      />
      <SettingsCard tone="danger" flush size="sm">
        <div className="grid gap-px bg-border/60">
          <div className="bg-card">
            <SettingsRow
              label="Download your data"
              description="Receive a JSON archive of your profile, donations, and assistance history."
              meta={
                exportStatus === "queued" || exportStatus === "processing" ? (
                  <Badge
                    variant="warning"
                    className="font-mono text-[10px] tracking-wide uppercase"
                  >
                    {exportStatus === "queued" ? "Queued" : "Processing"}
                  </Badge>
                ) : exportStatus === "ready" ? (
                  <Badge
                    variant="success"
                    className="font-mono text-[10px] tracking-wide uppercase"
                  >
                    Ready
                  </Badge>
                ) : exportStatus === "failed" ? (
                  <Badge
                    variant="destructive"
                    className="font-mono text-[10px] tracking-wide uppercase"
                  >
                    Failed
                  </Badge>
                ) : exportReadyAt ? (
                  <span className="font-mono text-xs text-muted-foreground">
                    {timeAgo(exportReadyAt)}
                  </span>
                ) : null
              }
              control={
                exportStatus === "ready" && exportDownloadUrl ? (
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<a href={exportDownloadUrl} />}
                  >
                    <Download className="mr-1.5 size-3.5" />
                    Download
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRequestExport}
                    disabled={
                      exportMut.isPending ||
                      exportStatus === "queued" ||
                      exportStatus === "processing"
                    }
                  >
                    <Download className="mr-1.5 size-3.5" />
                    {exportStatus === "queued" || exportStatus === "processing"
                      ? "Preparing…"
                      : exportStatus === "failed"
                        ? "Retry export"
                        : "Request export"}
                  </Button>
                )
              }
            />
          </div>
          <div className="bg-card">
            <SettingsRow
              label="Delete account"
              description={
                deletionStatus === "pending" && deletionScheduledFor
                  ? `Scheduled for ${timeAgo(deletionScheduledFor)}. You can cancel any time before then.`
                  : "Permanently delete your account and all associated data. This cannot be undone."
              }
              meta={
                deletionStatus === "pending" ? (
                  <Badge
                    variant="destructive"
                    className="font-mono text-[10px] tracking-wide uppercase"
                  >
                    Pending
                  </Badge>
                ) : null
              }
              control={
                deletionStatus === "pending" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onCancelDeletion}
                    disabled={cancelDeletionMut.isPending}
                  >
                    {cancelDeletionMut.isPending
                      ? "Cancelling…"
                      : "Cancel deletion"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-danger"
                    onClick={openDeleteDialog}
                  >
                    <Trash2 className="mr-1.5 size-3.5" />
                    Delete account
                  </Button>
                )
              }
            />
          </div>
        </div>
      </SettingsCard>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent size="default">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              Your account will be permanently deleted after a 14-day grace
              period. You can cancel any time before then.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <ApiFailure
              error={deletionMut.error}
              fallback="Could not schedule account deletion."
            />
            <div className="space-y-2">
              <Label htmlFor="delete-account-password">
                Confirm your password
              </Label>
              <Input
                id="delete-account-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(confirmErrors.password)}
              />
              {confirmErrors.password ? (
                <p className="text-xs text-danger">{confirmErrors.password}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-account-reason">
                Why are you leaving?{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="delete-account-reason"
                type="text"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="We read every reason."
                maxLength={1000}
                aria-invalid={Boolean(confirmErrors.reason)}
              />
              {confirmErrors.reason ? (
                <p className="text-xs text-danger">{confirmErrors.reason}</p>
              ) : null}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm">Keep account</AlertDialogCancel>
            <AlertDialogAction
              size="sm"
              variant="destructive"
              onClick={(event) => {
                event.preventDefault()
                onConfirmDelete()
              }}
              disabled={deletionMut.isPending}
            >
              {deletionMut.isPending ? "Scheduling…" : "Delete account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
