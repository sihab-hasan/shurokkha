import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { TableCell, TableRow } from "@shurokkha/ui/components/table"

export function DataTableLoading({
  columns,
  rows = 6,
}: {
  columns: number
  rows?: number
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, row) => (
        <TableRow key={row} aria-hidden="true">
          {Array.from({ length: columns }).map((__, column) => (
            <TableCell key={column}>
              <Skeleton
                className={column === 0 ? "h-4 w-36" : "h-4 w-full max-w-28"}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
