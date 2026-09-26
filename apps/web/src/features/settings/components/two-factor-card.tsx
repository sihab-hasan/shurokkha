"use client"

import { ShieldCheck } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { SettingsCard } from "@shurokkha/ui/components/settings-card"
import { SettingsSection } from "@shurokkha/ui/components/settings-section"

import { useProfile } from "../hooks/use-profile"
import {
  useDisableTwoFactor,
  useEnableTwoFactor,
} from "../hooks/use-two-factor"
import { ApiFailure, errorMessage } from "@/features/shared/api-feedback"
import { toast } from "@shurokkha/ui/components/sonner"

export function TwoFactorCard() {
  const { data, isPending } = useProfile()
  const enable = useEnableTwoFactor()
  const disable = useDisableTwoFactor()

  const twoFactorOn = Boolean(data?.two_factor_confirmed_at)
  const busy = enable.isPending || disable.isPending

  function onToggle() {
    if (busy) return
    if (twoFactorOn) {
      disable.mutate(undefined, {
        onSuccess: () => toast.success("Two-factor authentication disabled."),
        onError: (error) =>
          toast.error(
            errorMessage(error, "Could not disable two-factor authentication.")
          ),
      })
      return
    }
    enable.mutate(undefined, {
      onSuccess: () =>
        toast.success(
          "Two-factor authentication enabled. Save your recovery codes."
        ),
      onError: (error) =>
        toast.error(
          errorMessage(error, "Could not enable two-factor authentication.")
        ),
    })
  }

  return (
    <section className="space-y-4">
      <SettingsSection
        eyebrow="Authentication"
        title="Two-factor authentication"
        description="Add a second step to verify your identity at sign-in."
        metadata={
          isPending ? (
            <Badge
              variant="outline"
              className="font-mono text-[10px] tracking-wide uppercase"
            >
              Checking…
            </Badge>
          ) : twoFactorOn ? (
            <Badge
              variant="success"
              className="font-mono text-[10px] tracking-wide uppercase"
            >
              <ShieldCheck className="mr-1 size-3" />
              Enabled
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="font-mono text-[10px] tracking-wide uppercase"
            >
              Not enabled
            </Badge>
          )
        }
      />
      <SettingsCard flush size="sm">
        <div className="flex flex-col gap-3 px-6 py-5">
          <ApiFailure
            error={enable.error ?? disable.error}
            fallback="Could not update two-factor authentication."
          />
          <p className="text-sm text-muted-foreground">
            When enabled, you&apos;ll enter a one-time code from your
            authenticator app at every sign-in. Recovery codes are shown once
            when you enable it.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border/60 px-6 py-3">
          <Button
            variant={twoFactorOn ? "outline" : "default"}
            size="sm"
            disabled={isPending || busy}
            onClick={onToggle}
          >
            {twoFactorOn ? "Disable 2FA" : "Enable 2FA"}
          </Button>
        </div>
      </SettingsCard>
    </section>
  )
}
