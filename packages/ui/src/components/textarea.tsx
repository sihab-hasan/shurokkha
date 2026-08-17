import * as React from "react"

import { cn } from "@shurokkha/ui/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-base leading-6 transition-[color,box-shadow,border-color,background-color] duration-150 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20 md:text-sm dark:bg-input/20 dark:aria-invalid:border-danger/60 dark:aria-invalid:ring-danger/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
