import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type AuthShellProps = React.ComponentProps<"main"> & {
  story?: React.ReactNode
  mobileBrand?: React.ReactNode
  backAction?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  contentWidth?: string
  disableMotion?: boolean
}

export function AuthShell({
  story,
  mobileBrand,
  backAction,
  children,
  footer,
  contentWidth = "30rem",
  disableMotion = false,
  className,
  style,
  ...props
}: AuthShellProps) {
  return (
    <main
      data-ui-pattern="auth-shell"
      className={cn(
        "min-h-svh bg-background text-foreground",
        story && "lg:grid lg:grid-cols-2",
        disableMotion && "[&_*]:animate-none [&_*]:transition-none",
        className
      )}
      style={
        {
          "--pattern-auth-content-width": contentWidth,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {story ? <div className="hidden min-h-svh lg:block">{story}</div> : null}
      <section className="flex min-h-svh min-w-0 flex-col bg-background">
        {mobileBrand || backAction ? (
          <header className="h-20 shrink-0 px-5 sm:px-10 lg:px-12">
            <div className="flex h-full w-full items-center justify-between lg:justify-end">
              {mobileBrand ? (
                <div className="lg:hidden">{mobileBrand}</div>
              ) : null}
              {backAction}
            </div>
          </header>
        ) : null}
        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-10 lg:px-12 lg:py-10">
          <div className="w-full max-w-(--pattern-auth-content-width)">
            {children}
          </div>
        </div>
        {footer ? <footer className="shrink-0">{footer}</footer> : null}
      </section>
    </main>
  )
}
