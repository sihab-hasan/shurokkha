"use client"

import { Columns3, SlidersHorizontal } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shurokkha/ui/components/dropdown-menu"

type Density = "compact" | "default" | "comfortable"

interface ColumnOption {
  key: string
  label: string
}

interface TablePrefsMenuProps {
  density: Density
  onDensityChange: (density: Density) => void
  columns: Record<string, boolean>
  columnOptions: ColumnOption[]
  onColumnToggle: (key: string, visible: boolean) => void
  onReset?: () => void
}

/**
 * "View" menu exposing density (radio) and column visibility (checkboxes).
 * Density persistence is the caller's responsibility; menu is dumb.
 */
export function TablePrefsMenu({
  density,
  onDensityChange,
  columns,
  columnOptions,
  onColumnToggle,
  onReset,
}: TablePrefsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            aria-label="Table view options"
          />
        }
      >
        <SlidersHorizontal className="h-4 w-4" />
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Density</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={density}
          onValueChange={(value) => onDensityChange(value as Density)}
        >
          <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable">
            Comfortable
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2">
          <Columns3 className="h-3.5 w-3.5" />
          Columns
        </DropdownMenuLabel>
        {columnOptions.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={columns[column.key] !== false}
            onCheckedChange={(checked) => onColumnToggle(column.key, checked)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
        {onReset ? (
          <>
            <DropdownMenuSeparator />
            <button
              type="button"
              onClick={onReset}
              className="block w-full px-3 py-2 text-left text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Reset to defaults
            </button>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
