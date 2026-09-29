"use client"

import Link from "next/link"
import { Trash2 } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shurokkha/ui/components/table"

import { adminRoutes } from "@/config/routes"
import { useFundraises } from "@/hooks/operations/use-fundraises"

import { Can } from "@/components/auth/can"
import { statusBadgeClass } from "./badges"

const formatAmount = (value: number, currency: string = "BDT") => {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  })
  return `${currency} ${formatter.format(value)}`
}

export function FundraiseTable() {
  const { data, isLoading, remove } = useFundraises()

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Fundraise Campaigns</span>
            <Badge variant="outline" className="font-mono text-xs">
              {data.length} records
            </Badge>
          </CardTitle>
          <CardDescription>
            Active and historical donation campaigns.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Goal</TableHead>
                <TableHead className="text-right">Raised</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Beneficiary</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading campaigns...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No campaigns yet. Create one to start raising funds.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => {
                  const pct =
                    row.goal_amount > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (row.raised_amount / row.goal_amount) * 100
                          )
                        )
                      : 0
                  return (
                    <TableRow
                      key={row.fundraise_id}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="font-mono text-xs font-medium">
                        <Link
                          href={adminRoutes.operations.fundraises.detail(
                            row.fundraise_id
                          )}
                          className="hover:underline"
                        >
                          #{row.fundraise_id}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="line-clamp-1 text-sm font-medium">
                          {row.title}
                        </div>
                        <span className="line-clamp-1 text-xs text-muted-foreground">
                          /{row.slug}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {formatAmount(row.goal_amount, row.currency)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        <div>
                          {formatAmount(row.raised_amount, row.currency)}
                        </div>
                        <div className="text-muted-foreground">{pct}%</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusBadgeClass(row.status)}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.beneficiary_name || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Can role="admin">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => remove.mutate(row.fundraise_id)}
                            disabled={remove.isPending}
                            title="Delete Campaign"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </Can>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
