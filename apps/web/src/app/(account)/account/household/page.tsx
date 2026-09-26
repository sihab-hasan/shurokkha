import Link from "next/link"

import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { routes } from "@/config/routes"

export default function HouseholdPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Household & Family Roster"
          actions={<Button>Add Member</Button>}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Member #1 (Head of Household)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">NID Verified • Adult Male</p>
              <Button
                size="sm"
                variant="outline"
                render={
                  <Link href={routes.account.householdMember("MBR-001")} />
                }
              >
                Member Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
