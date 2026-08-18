"use client"

import { useState, type FormEvent } from "react"

import { createApiClient, ApiError } from "@shurokkha/api-client"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { Textarea } from "@shurokkha/ui/components/textarea"

export type CreateRoleInput = {
  role_name: string
  description: string
}

type CreateRoleStatus = {
  type: "success" | "error" | "info"
  message: string
} | null

export type CreateRoleProps = {
  /**
   * Role creation is intentionally injected by the feature that owns the
   * backend contract. The shared component must not hard-code an API origin or
   * assume that a dynamic role-management endpoint already exists.
   */
  onCreateRole?: (input: CreateRoleInput) => Promise<void>
}

const INITIAL_FORM: CreateRoleInput = {
  role_name: "",
  description: "",
}

export default function CreateRole({ onCreateRole }: CreateRoleProps) {
  const [formData, setFormData] = useState<CreateRoleInput>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<CreateRoleStatus>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const roleName = formData.role_name.trim()
    const description = formData.description.trim()

    if (!roleName) {
      setStatus({ type: "error", message: "Role name is required." })
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      if (onCreateRole) {
        await onCreateRole({ role_name: roleName, description })
      } else {
        const apiClient = createApiClient({
          baseUrl:
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
        })
        await apiClient.post("roles", {
          role_name: roleName,
          description: description || undefined,
        })
      }
      setFormData(INITIAL_FORM)
      setStatus({ type: "success", message: "Role successfully created." })
    } catch (error) {
      console.error("Create role error:", error)
      setStatus({
        type: "error",
        message:
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to create role.",
      })
    } finally {
      setLoading(false)
    }
  }

  const alertVariant =
    status?.type === "success"
      ? "success"
      : status?.type === "error"
        ? "destructive"
        : "info"

  return (
    <Card className="mx-auto my-10 w-full max-w-md">
      <CardHeader>
        <CardTitle>Create new role</CardTitle>
        <CardDescription>
          Define the role name and an optional description. Backend submission
          is supplied by the owning admin feature.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {status ? (
            <Alert variant={alertVariant} aria-live="polite">
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="role_name">Role name</Label>
            <Input
              id="role_name"
              name="role_name"
              placeholder="e.g. Admin, Volunteer, Donor"
              value={formData.role_name}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  role_name: event.target.value,
                }))
              }
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Write role responsibilities..."
              value={formData.description}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create role"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
