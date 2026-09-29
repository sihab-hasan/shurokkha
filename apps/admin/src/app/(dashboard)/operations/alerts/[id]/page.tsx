import type { Metadata } from "next"

import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { AlertDetails } from "@/components/operations"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Alert #${id}`,
    description: `Details for alert #${id}.`,
  }
}

export default async function AlertDetailPage({ params }: PageProps) {
  const { id } = await params
  const numericId = Number.parseInt(id, 10)

  if (!Number.isFinite(numericId)) {
    return (
      <Section className="py-8 sm:py-10">
        <Container className="text-sm text-muted-foreground">
          Invalid alert id: {id}
        </Container>
      </Section>
    )
  }

  return (
    <Section className="py-8 sm:py-10">
      <Container className="max-w-3xl">
        <AlertDetails alertId={numericId} />
      </Container>
    </Section>
  )
}
