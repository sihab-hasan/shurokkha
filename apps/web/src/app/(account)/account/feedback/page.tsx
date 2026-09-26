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

export default function FeedbackPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader title="Platform & Relief Feedback" />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Shelter Camp Hygiene Feedback</CardTitle>
              <Button
                size="sm"
                variant="outline"
                render={<Link href={routes.account.feedbackItem("FDB-104")} />}
              >
                View Thread
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Submitted on Sep 20, 2026 for Sylhet Sadar Camp 4.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
