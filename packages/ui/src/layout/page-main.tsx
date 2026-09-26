import type { ComponentProps } from "react"

import { cn } from "../lib/utils"

export type PageMainProps = ComponentProps<"main">

export function PageMain({
  children,
  className,
  id = "main-content",
  ...props
}: PageMainProps) {
  return (
    <main id={id} className={cn("min-h-screen flex-1", className)} {...props}>
      {children}
    </main>
  )
}
