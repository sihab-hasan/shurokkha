"use client"

import Link from "next/link"
import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
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
import { useLoginAudits } from "@/hooks/operations/use-login-audits"

export function LoginAuditTable() {
  const [successFilter, setSuccessFilter] = useState<"" | "true" | "false">("")
  const [userFilter, setUserFilter] = useState<string>("")

  const { data, isLoading } = useLoginAudits({
    successful: successFilter === "" ? undefined : successFilter === "true",
    user_id: userFilter ? Number(userFilter) : undefined,
  })

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Login Audits</span>
            <Badge variant="outline" className="font-mono text-xs">
              {data.length} records
            </Badge>
          </CardTitle>
          <CardDescription>
            Authentication history for all users, success and failure.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            aria-label="Filter by user id"
            placeholder="User ID"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="h-9 w-32 rounded-md border border-input bg-background px-3 py-1 text-sm"
          />
          <select
            aria-label="Filter by result"
            value={successFilter}
            onChange={(e) =>
              setSuccessFilter(e.target.value as "" | "true" | "false")
            }
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            <option value="true">Success</option>
            <option value="false">Failure</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>User Agent</TableHead>
                <TableHead>Signed In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading audits...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No matching audits.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.audit_id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-medium">
                      <Link
                        href={adminRoutes.loginAudits.detail(row.audit_id)}
                        className="hover:underline"
                      >
                        #{row.audit_id}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.user_id != null ? `#${row.user_id}` : "—"}
                    </TableCell>
                    <TableCell>
                      {row.successful ? (
                        <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="size-3" /> success
                        </Badge>
                      ) : (
                        <Badge className="gap-1 border-destructive/30 bg-destructive/15 text-destructive">
                          <XCircle className="size-3" /> failure
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.ip_address || "—"}
                    </TableCell>
                    <TableCell className="max-w-md truncate text-xs text-muted-foreground">
                      {row.user_agent || "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.signed_in_at
                        ? new Date(row.signed_in_at).toLocaleString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
