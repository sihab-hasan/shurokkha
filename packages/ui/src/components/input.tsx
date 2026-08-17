import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@shurokkha/ui/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-(--control-height) w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base transition-[color,box-shadow,border-color,background-color] duration-150 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20 md:text-sm dark:bg-input/20 dark:aria-invalid:border-danger/60 dark:aria-invalid:ring-danger/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
