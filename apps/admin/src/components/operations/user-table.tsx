"use client"

import Link from "next/link"
import { useState } from "react"
import { RotateCcw, Shield, ShieldOff, Trash2, User } from "lucide-react"

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
import { useUsers } from "@/hooks/operations/use-users"
import type { UserStatus } from "@/hooks/operations/types"

import { statusBadgeClass } from "./badges"

const STATUS_FILTERS: (UserStatus | "")[] = [
  "",
  "active",
  "suspended",
  "pending",
  "deleted",
]
const ROLE_FILTERS: ("user" | "admin" | "")[] = ["", "user", "admin"]

export function UserTable() {
  const [roleFilter, setRoleFilter] = useState<"" | "user" | "admin">("")
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("")
  const [search, setSearch] = useState("")

  const { data, isLoading, remove, restore, assignRole } = useUsers({
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    q: search || undefined,
  })

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Users</span>
            <Badge variant="outline" className="font-mono text-xs">
              {data.length} records
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage citizens and admin accounts. Suspend or assign role.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            aria-label="Search users"
            placeholder="Search name/email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          />
          <select
            aria-label="Filter by role"
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as "" | "user" | "admin")
            }
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          >
            <option value="">All roles</option>
            {ROLE_FILTERS.filter(Boolean).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus | "")}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          >
            <option value="">All statuses</option>
            {STATUS_FILTERS.filter(Boolean).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No matching users.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-medium">
                      <Link
                        href={adminRoutes.users.detail(row.id)}
                        className="hover:underline"
                      >
                        #{row.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {row.full_name || row.name}
                      </div>
                      {row.phone ? (
                        <div className="font-mono text-xs text-muted-foreground">
                          {row.phone}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.email}
                    </TableCell>
                    <TableCell>
                      {row.role === "admin" ? (
                        <Badge className="gap-1 border-primary/30 bg-primary/15 text-primary">
                          <Shield className="size-3" /> admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <User className="size-3" /> user
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusBadgeClass(row.status)}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {row.role === "user" ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Promote to admin"
                            onClick={() =>
                              assignRole.mutate({
                                id: row.id,
                                input: { role: "admin" },
                              })
                            }
                            disabled={assignRole.isPending}
                          >
                            <Shield className="size-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Demote to user"
                            onClick={() =>
                              assignRole.mutate({
                                id: row.id,
                                input: { role: "user" },
                              })
                            }
                            disabled={assignRole.isPending}
                          >
                            <ShieldOff className="size-4" />
                          </Button>
                        )}
                        {row.status === "deleted" ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Restore user"
                            onClick={() => restore.mutate(row.id)}
                            disabled={restore.isPending}
                          >
                            <RotateCcw className="size-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            title="Delete user"
                            onClick={() => remove.mutate(row.id)}
                            disabled={remove.isPending}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
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
