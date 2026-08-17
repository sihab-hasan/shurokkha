"use client"

import { Button } from "@shurokkha/ui/components/button"

type Provider = "google" | "microsoft" | "github"

interface SocialAuthButtonProps {
  provider: Provider
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
}

const providers: Record<
  Provider,
  {
    label: string
    icon: React.ReactNode
  }
> = {
  google: {
    label: "Continue with Google",
    icon: (
      <svg aria-hidden="true" className="size-5 shrink-0" viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.3-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.7 15 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2c-2.1 1.6-4.6 2.4-7.3 2.4-5.3 0-9.8-3.3-11.4-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.1 6.9l6.2 5.2C39 36.8 44 31 44 24c0-1.3-.1-2.3-.4-3.5z"
        />
      </svg>
    ),
  },

  microsoft: {
    label: "Continue with Microsoft",
    icon: (
      <svg aria-hidden="true" className="size-5 shrink-0" viewBox="0 0 23 23">
        <rect x="1" y="1" width="9" height="9" fill="#F25022" />
        <rect x="13" y="1" width="9" height="9" fill="#7FBA00" />
        <rect x="1" y="13" width="9" height="9" fill="#00A4EF" />
        <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
      </svg>
    ),
  },

  github: {
    label: "Continue with GitHub",
    icon: (
      <svg
        aria-hidden="true"
        className="size-5 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.1.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.37-1.34-1.73-1.34-1.73-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.08 1.83 2.82 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.32-5.47-5.9 0-1.3.47-2.37 1.23-3.2-.12-.3-.53-1.53.12-3.18 0 0 1-.32 3.3 1.22a11.4 11.4 0 0 1 6 0c2.3-1.54 3.3-1.22 3.3-1.22.65 1.65.24 2.88.12 3.18.77.83 1.23 1.9 1.23 3.2 0 4.6-2.8 5.6-5.48 5.9.43.37.82 1.1.82 2.23v3.3c0 .32.22.69.83.58A12 12 0 0 0 12 .5z" />
      </svg>
    ),
  },
}

export function SocialAuthButton({
  provider,
  onClick,
  disabled,
  isLoading,
}: SocialAuthButtonProps) {
  const { label, icon } = providers[provider]

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className="relative h-11 w-full rounded-md border-border/80 bg-background px-12 text-sm font-semibold shadow-xs transition-none active:not-aria-[haspopup]:translate-y-0"
    >
      <span className="absolute left-5 flex items-center justify-center">
        {icon}
      </span>
      <span>{isLoading ? "Please wait..." : label}</span>
    </Button>
  )
}
