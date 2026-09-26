import type { ComponentProps } from "react"

import { cn } from "../lib/utils"

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full"

export type ContainerProps = ComponentProps<"div"> & {
  size?: ContainerSize
  padded?: boolean
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
}

export function Container({
  children,
  className,
  size = "xl",
  padded = true,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        padded && "px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
