import Link from "next/link"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { routes } from "@/config/routes"
import { VolunteeringClient } from "./_components/volunteering-client"

export default function VolunteeringPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Volunteering & Rescue Missions"
          description="Your volunteer application status, missions, and active assignments."
          actions={
            <Button
              nativeButton={false}
              render={<Link href={routes.account.volunteeringApplication} />}
            >
              Apply as Volunteer
            </Button>
          }
        />
        <VolunteeringClient />
      </Container>
    </Section>
  )
}
