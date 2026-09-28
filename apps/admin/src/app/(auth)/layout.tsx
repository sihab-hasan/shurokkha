import type { ReactNode } from "react"

/**
 * Layout for the (auth) route group (currently just `/login`).
 *
 * The root `<html>` / `<body>` shell, fonts, theme script, and providers
 * all live in `src/app/layout.tsx`. This file only positions the form on
 * the page — no card or surface chrome, so the form fields stand alone.
 *
 * `h-dvh overflow-hidden` keeps the page from scrolling: the form is sized
 * to fit any viewport and the centered column does not introduce overflow.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden p-6">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
