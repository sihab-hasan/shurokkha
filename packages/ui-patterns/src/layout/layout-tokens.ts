export type ContentWidth =
  "full" | "wide" | "default" | "narrow" | "reading" | "form" | "prose"
export type ContentPadding = "none" | "compact" | "default" | "comfortable"

/**
 * Shared content widths. Public shell chrome and public page content use
 * `default` unless a deliberately wider canvas or narrower reading/form surface is required.
 */
export const contentWidthClass: Record<ContentWidth, string> = {
  full: "max-w-none",
  wide: "max-w-[96rem]",
  default: "max-w-[88rem]",
  narrow: "max-w-5xl",
  reading: "max-w-3xl",
  form: "max-w-2xl",
  prose: "max-w-3xl",
}

/** 16px mobile, 24px tablet, 32px desktop is the canonical content gutter. */
export const contentPaddingClass: Record<ContentPadding, string> = {
  none: "",
  compact: "px-4 py-4 sm:px-5 md:px-6",
  default: "px-4 py-5 sm:px-6 md:py-6 lg:px-8",
  comfortable: "px-4 py-6 sm:px-6 md:py-8 lg:px-8",
}
