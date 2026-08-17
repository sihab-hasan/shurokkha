"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@shurokkha/ui/components/input-group"
import { cn } from "@shurokkha/ui/lib/utils"

interface AuthPasswordInputProps extends Omit<
  React.ComponentProps<"input">,
  "type"
> {
  showLabel?: string
  hideLabel?: string
}

export function AuthPasswordInput({
  className,
  showLabel = "Show password",
  hideLabel = "Hide password",
  ...props
}: AuthPasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const actionLabel = isVisible ? hideLabel : showLabel

  return (
    <InputGroup className="h-10 rounded-md">
      <InputGroupInput
        type={isVisible ? "text" : "password"}
        className={cn("h-full", className)}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-sm"
          aria-label={actionLabel}
          title={actionLabel}
          onClick={() => setIsVisible((visible) => !visible)}
        >
          {isVisible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
