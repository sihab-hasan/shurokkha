"use client"

import * as React from "react"

import { TooltipProvider } from "../components/tooltip"
import { ThemeProvider } from "./theme-provider"

export type UiProviderProps = {
  children: React.ReactNode
}

/** Shared UI context required by all Shurokkha React applications. */
export function UiProvider({ children }: UiProviderProps) {
  return (
    <ThemeProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  )
}
