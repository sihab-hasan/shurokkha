import * as React from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@shurokkha/ui/components/resizable"
import { cn } from "@shurokkha/ui/lib/utils"

export type SplitViewProps = React.ComponentProps<
  typeof ResizablePanelGroup
> & {
  primary: React.ReactNode
  secondary: React.ReactNode
  primaryDefaultSize?: number
  primaryMinSize?: number
  secondaryMinSize?: number
}

export function SplitView({
  primary,
  secondary,
  primaryDefaultSize = 58,
  primaryMinSize = 30,
  secondaryMinSize = 25,
  className,
  ...props
}: SplitViewProps) {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className={cn(
        "min-h-[28rem] overflow-hidden rounded-xl border bg-card",
        className
      )}
      {...props}
    >
      <ResizablePanel
        defaultSize={`${primaryDefaultSize}%`}
        minSize={`${primaryMinSize}%`}
        className="min-w-0"
      >
        {primary}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={`${secondaryMinSize}%`} className="min-w-0">
        {secondary}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
