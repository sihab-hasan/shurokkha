import * as React from "react"
import { cn } from "@shurokkha/ui/lib/utils"

export type ProcessStepStatus = "complete" | "current" | "upcoming" | "error"

export type ProcessStep = {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  status?: ProcessStepStatus
  indicator?: React.ReactNode
  meta?: React.ReactNode
}

export type ProcessStepsProps = Omit<React.ComponentProps<"ol">, "children"> & {
  steps: ProcessStep[]
  orientation?: "vertical" | "horizontal"
  numbered?: boolean
}

const indicatorClasses: Record<ProcessStepStatus, string> = {
  complete: "border-primary bg-primary text-primary-foreground",
  current: "border-primary bg-background text-primary ring-4 ring-primary/10",
  upcoming: "border-border bg-muted text-muted-foreground",
  error: "border-destructive bg-danger text-primary-foreground",
}

export function ProcessSteps({
  steps,
  orientation = "vertical",
  numbered = true,
  className,
  style,
  ...props
}: ProcessStepsProps) {
  const horizontal = orientation === "horizontal"

  return (
    <ol
      data-ui-pattern="process-steps"
      data-orientation={orientation}
      className={cn(
        horizontal
          ? "grid gap-0 sm:auto-cols-fr sm:grid-flow-col sm:gap-4"
          : "space-y-0",
        className
      )}
      style={style}
      {...props}
    >
      {steps.map((step, index) => {
        const status = step.status ?? "upcoming"
        const isLast = index === steps.length - 1
        return (
          <li
            key={step.id}
            className={cn(
              "relative min-w-0",
              horizontal
                ? "grid grid-cols-[2rem_minmax(0,1fr)] gap-3 pb-6 last:pb-0 sm:block sm:pt-10 sm:pb-0 sm:text-center"
                : "grid grid-cols-[2rem_minmax(0,1fr)] gap-3 pb-6 last:pb-0"
            )}
            aria-current={status === "current" ? "step" : undefined}
          >
            {!isLast ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bg-border",
                  horizontal
                    ? "top-8 bottom-0 left-[0.98rem] w-px sm:top-4 sm:bottom-auto sm:left-[calc(50%+1rem)] sm:h-px sm:w-[calc(100%-2rem)]"
                    : "top-8 bottom-0 left-[0.98rem] w-px"
                )}
              />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                "z-10 flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold",
                horizontal
                  ? "relative sm:absolute sm:top-0 sm:left-1/2 sm:-translate-x-1/2"
                  : "relative",
                indicatorClasses[status]
              )}
            >
              {step.indicator ?? (numbered ? index + 1 : null)}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{step.title}</div>
              {step.description ? (
                <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </div>
              ) : null}
              {step.meta ? (
                <div className="mt-2 text-xs text-muted-foreground">
                  {step.meta}
                </div>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
