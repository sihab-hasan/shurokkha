"use client"

import { Laptop, Moon, Sun } from "lucide-react"
import { cn } from "../lib/utils"
import { buttonVariants } from "./button"
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { useTheme } from "../providers/theme-provider"

interface ThemeSwitcherProps {
  className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "relative cursor-pointer",
                    className
                  )}
                >
                  <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </button>
              }
            />
          }
        />
        <TooltipContent side="bottom">Toggle theme</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-44 ring-0">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className="cursor-pointer gap-2 text-xs font-semibold"
          >
            <Sun className="text-muted-foreground" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className="cursor-pointer gap-2 text-xs font-semibold"
          >
            <Moon className="text-muted-foreground" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className="cursor-pointer gap-2 text-xs font-semibold"
          >
            <Laptop className="text-muted-foreground" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
