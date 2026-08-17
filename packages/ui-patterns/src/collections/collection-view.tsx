import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type CollectionViewProps = React.ComponentProps<"section"> & {
  header?: React.ReactNode
  toolbar?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  loading?: React.ReactNode
  error?: React.ReactNode
  empty?: React.ReactNode
  isLoading?: boolean
  hasError?: boolean
  isEmpty?: boolean
  surface?: "plain" | "card"
}

export function CollectionView({
  header,
  toolbar,
  children,
  footer,
  loading,
  error,
  empty,
  isLoading = false,
  hasError = false,
  isEmpty = false,
  surface = "plain",
  className,
  ...props
}: CollectionViewProps) {
  return (
    <section
      data-ui-pattern="collection-view"
      className={cn(
        "min-w-0",
        surface === "card" && "overflow-hidden rounded-xl border bg-card",
        className
      )}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {header ? (
        <div className={cn(surface === "card" && "border-b p-5")}>{header}</div>
      ) : null}
      {toolbar ? (
        <div className={cn(surface === "card" && "border-b p-4")}>
          {toolbar}
        </div>
      ) : null}
      <div className="min-w-0">
        {isLoading ? loading : hasError ? error : isEmpty ? empty : children}
      </div>
      {footer ? (
        <div className={cn(surface === "card" && "border-t p-4")}>{footer}</div>
      ) : null}
    </section>
  )
}
