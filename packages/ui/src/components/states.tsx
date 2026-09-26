import * as React from "react"
import { cn } from "../lib/utils"

export const LoadingState = ({
  message = "Loading...",
  variant,
  lines,
  label,
  className,
  ...props
}: any) => (
  <div
    className={cn(
      "flex min-h-[400px] flex-col items-center justify-center gap-4 text-muted-foreground",
      className
    )}
    {...props}
  >
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    <p>{message}</p>
  </div>
)

export const ErrorState = ({
  title = "Something went wrong",
  message,
  description,
  errorCode,
  onRetry,
  children,
  className,
  ...props
}: any) => (
  <div
    className={cn(
      "flex min-h-[400px] flex-col items-center justify-center gap-4 text-center",
      className
    )}
    {...props}
  >
    <div className="rounded-full bg-destructive/10 p-3 text-destructive">
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
    <div className="space-y-1">
      <h3 className="text-lg font-semibold">{title}</h3>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
    {children}
  </div>
)

export const EmptyState = ({
  title = "No data available",
  message,
  icon,
  children,
  className,
  ...props
}: any) => (
  <div
    className={cn(
      "flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-md border border-dashed p-8 text-center",
      className
    )}
    {...props}
  >
    {icon && <div className="text-muted-foreground">{icon}</div>}
    <div className="space-y-1">
      <h3 className="text-lg font-semibold">{title}</h3>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
    {children}
  </div>
)
