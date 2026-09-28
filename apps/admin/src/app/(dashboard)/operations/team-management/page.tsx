import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { Can } from "@/components/auth/can"
import {
  TeamAssignmentForm,
  TeamAssignmentTable,
} from "@/components/operations"

export const metadata: Metadata = {
  title: "Team Management",
  description: "Active assignments of rescue teams to emergency requests.",
}

export default function TeamManagementPage() {
  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Team Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Live assignments linking rescue teams to emergency requests.
            </p>
          </div>
          <Can role="admin">
            <Button
              nativeButton={false}
              render={<Link href={adminRoutes.operations.teamManagement.new} />}
            >
              <Plus className="size-4" /> New Assignment
            </Button>
          </Can>
        </header>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <TeamAssignmentForm />
          </div>
          <div className="lg:col-span-8">
            <TeamAssignmentTable />
          </div>
        </div>
      </Container>
    </Section>
  )
}
