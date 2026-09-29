"use client"

import Link from "next/link"
import {
  ArrowLeft,
  RotateCcw,
  Shield,
  ShieldOff,
  Trash2,
  User,
} from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

import { adminRoutes } from "@/config/routes"
import { useUser } from "@/hooks/operations/use-users"

import { statusBadgeClass } from "./badges"
import { UserForm } from "./user-form"

export function UserDetails({ userId }: { userId: number }) {
  const { user, isLoading, remove, restore, assignRole } = useUser(userId)

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading user...
      </div>
    )
  }

  if (!user) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">User #{userId} not found.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            nativeButton={false}
            render={<Link href={adminRoutes.users.list} />}
          >
            <ArrowLeft className="size-4" /> Back to list
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={adminRoutes.users.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Users
        </Button>
        <div className="flex gap-2">
          {user.role === "user" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                assignRole.mutate({ id: user.id, input: { role: "admin" } })
              }
              disabled={assignRole.isPending}
            >
              <Shield className="size-4" /> Promote to admin
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                assignRole.mutate({ id: user.id, input: { role: "user" } })
              }
              disabled={assignRole.isPending}
            >
              <ShieldOff className="size-4" /> Demote to user
            </Button>
          )}
          {user.status === "deleted" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => restore.mutate(user.id)}
              disabled={restore.isPending}
            >
              <RotateCcw className="size-4" /> Restore
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => remove.mutate(user.id)}
              disabled={remove.isPending}
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          )}
        </div>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                {user.role === "admin" ? (
                  <Shield className="size-5" />
                ) : (
                  <User className="size-5" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {user.full_name || user.name}
                </CardTitle>
                <CardDescription>
                  User #{user.id} · {user.email}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={
                  user.role === "admin"
                    ? "gap-1 border-primary/30 bg-primary/15 text-primary"
                    : "gap-1"
                }
              >
                {user.role === "admin" ? (
                  <Shield className="size-3" />
                ) : (
                  <User className="size-3" />
                )}
                {user.role}
              </Badge>
              <Badge
                variant="outline"
                className={statusBadgeClass(user.status)}
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Email
            </p>
            <p className="font-mono text-sm">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Phone
            </p>
            <p className="font-mono text-sm">{user.phone || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Timezone
            </p>
            <p className="font-mono text-sm">{user.timezone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Email Verified
            </p>
            <p className="font-mono text-sm">
              {user.email_verified_at
                ? new Date(user.email_verified_at).toLocaleString()
                : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              2FA
            </p>
            <p className="font-mono text-sm">
              {user.two_factor_confirmed_at ? "Enabled" : "Disabled"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Created
            </p>
            <p className="font-mono text-sm">
              {user.created_at
                ? new Date(user.created_at).toLocaleString()
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Edit User</CardTitle>
          <CardDescription>
            Update profile, role, or status. Password is optional on edit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            initial={{
              id: user.id,
              name: user.name,
              full_name: user.full_name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              status: user.status,
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
