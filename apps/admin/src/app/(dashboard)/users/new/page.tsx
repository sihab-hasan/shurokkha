import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { RequireRole } from "@/components/auth/require-role"
import { UserForm } from "@/components/operations"

export const metadata: Metadata = {
  title: "New User",
  description: "Create a new admin or citizen user.",
}

export default function NewUserPage() {
  return (
    <RequireRole role="admin">
      <Section className="py-8 sm:py-10">
        <Container className="max-w-xl space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 w-fit"
            nativeButton={false}
            render={<Link href={adminRoutes.users.list} />}
          >
            <ArrowLeft className="size-4" /> Back to Users
          </Button>

          <header>
            <h1 className="text-2xl font-semibold tracking-tight">New User</h1>
            <p className="text-sm text-muted-foreground">
              Create a new account. Set the role to grant admin privileges.
            </p>
          </header>

          <UserForm />
        </Container>
      </Section>
    </RequireRole>
  )
}
