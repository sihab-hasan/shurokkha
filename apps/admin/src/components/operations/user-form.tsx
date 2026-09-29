"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"

import { adminRoutes } from "@/config/routes"
import { useUsers } from "@/hooks/operations/use-users"
import type { UserStatus } from "@/hooks/operations/types"

export interface UserFormProps {
  initial?: {
    id: number
    name: string
    full_name: string
    email: string
    phone: string | null
    role: "user" | "admin"
    status: string
  }
}

export function UserForm({ initial }: UserFormProps) {
  const router = useRouter()
  const { create, update } = useUsers()

  const [name, setName] = useState(initial?.name ?? "")
  const [fullName, setFullName] = useState(initial?.full_name ?? "")
  const [email, setEmail] = useState(initial?.email ?? "")
  const [phone, setPhone] = useState<string>(initial?.phone ?? "")
  const [role, setRole] = useState<"user" | "admin">(initial?.role ?? "user")
  const [status, setStatus] = useState<UserStatus>(
    (initial?.status as UserStatus) ?? "active"
  )
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setFullName(initial.full_name)
      setEmail(initial.email)
      setPhone(initial.phone ?? "")
      setRole(initial.role)
      setStatus(initial.status as UserStatus)
      setPassword("")
    }
  }, [initial])

  const isEdit = Boolean(initial)
  const pending = isEdit ? update.isPending : create.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    if (!isEdit && !password) return

    if (isEdit) {
      update.mutate(
        {
          id: initial!.id,
          input: {
            name,
            full_name: fullName || name,
            email,
            phone: phone || null,
            role,
            status,
            ...(password ? { password } : {}),
          },
        },
        {
          onSuccess: () => router.push(adminRoutes.users.detail(initial!.id)),
        }
      )
    } else {
      create.mutate(
        {
          name,
          full_name: fullName || name,
          email,
          phone: phone || null,
          role,
          password,
        },
        {
          onSuccess: () => router.push(adminRoutes.users.list),
        }
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Username *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="alice"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Alice Rahman"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alice@example.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+8801700000000"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="role">Role *</Label>
          <NativeSelect
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </NativeSelect>
        </div>
        {isEdit ? (
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <NativeSelect
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
            >
              <option value="active">active</option>
              <option value="suspended">suspended</option>
              <option value="pending">pending</option>
            </NativeSelect>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="password">
              Password {isEdit ? "(leave blank to keep)" : "*"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEdit ? "••••••••" : "Min 8 characters"}
              required={!isEdit}
            />
          </div>
        )}
      </div>

      {isEdit ? (
        <div className="space-y-1.5">
          <Label htmlFor="password">New Password (optional)</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
      </Button>
    </form>
  )
}
