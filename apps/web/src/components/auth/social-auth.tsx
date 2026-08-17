"use client"

import { Separator } from "@shurokkha/ui/components/separator"

import { SocialAuthButton } from "./social-auth-button"

export type Provider = "google" | "microsoft" | "github"

interface SocialAuthProps {
  providers?: Provider[]
  showDivider?: boolean
  onProviderSelect?: (provider: Provider) => void
}

export function SocialAuth({
  providers = ["google", "microsoft"],
  showDivider = true,
  onProviderSelect,
}: SocialAuthProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {providers.map((provider) => (
          <SocialAuthButton
            key={provider}
            provider={provider}
            onClick={() => onProviderSelect?.(provider)}
          />
        ))}
      </div>

      {showDivider ? (
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            Or continue with email
          </span>
          <Separator className="flex-1" />
        </div>
      ) : null}
    </div>
  )
}
