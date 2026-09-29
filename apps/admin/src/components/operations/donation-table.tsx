"use client"

import { Trash2, Wallet } from "lucide-react"

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

import { useDonations } from "@/hooks/operations/use-donations"

import { Can } from "@/components/auth/can"
import { statusBadgeClass } from "./badges"

const formatAmount = (value: number, currency: string) =>
  `${currency} ${new Intl.NumberFormat("en-US").format(value)}`

export function DonationTable() {
  const { data, isLoading, stats, statsLoading, remove } = useDonations()

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Lifetime Total
            </p>
            <p className="font-mono text-2xl">
              {statsLoading
                ? "…"
                : stats
                  ? formatAmount(stats.lifetime_sum, "BDT")
                  : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              One-time / Recurring
            </p>
            <p className="font-mono text-2xl">
              {statsLoading
                ? "…"
                : stats
                  ? `${stats.one_time} / ${stats.recurring}`
                  : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Pending / Completed
            </p>
            <p className="font-mono text-2xl">
              {statsLoading
                ? "…"
                : stats
                  ? `${stats.pending} / ${stats.completed}`
                  : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="size-5" />
              <span>Donations</span>
              <Badge variant="outline" className="font-mono text-xs">
                {data.length} records
              </Badge>
            </CardTitle>
            <CardDescription>
              All donation records. Use the form to record a manual entry.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Loading donations...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No donations yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow
                      key={row.donation_id}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="font-mono text-xs font-medium">
                        #{row.donation_id}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.receipt_number || "—"}
                      </TableCell>
                      <TableCell className="max-w-xs text-sm">
                        <div className="line-clamp-1">
                          {row.campaign_title || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {row.donation_kind}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.donor_name || "Anonymous"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {formatAmount(row.amount, row.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusBadgeClass(row.status)}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Can role="admin">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => remove.mutate(row.donation_id)}
                            disabled={remove.isPending}
                            title="Delete Donation"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </Can>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
