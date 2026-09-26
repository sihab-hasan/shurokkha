"use client"

import { ErrorState } from "@shurokkha/ui/components/states"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Section className="py-12">
      <Container>
        <ErrorState
          title="Page unavailable"
          description="This public page could not be loaded. Retry without leaving the Shurokkha site shell."
          errorCode={error.digest}
          onRetry={reset}
        />
      </Container>
    </Section>
  )
}
