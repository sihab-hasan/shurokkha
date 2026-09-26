import { LoadingState } from "@shurokkha/ui/components/states"
import { Section } from "@shurokkha/ui/layout/section"
import { Container } from "@shurokkha/ui/layout/container"

export default function PublicLoading() {
  return (
    <Section className="py-12">
      <Container>
        <LoadingState variant="skeleton" lines={7} label="Loading page" />
      </Container>
    </Section>
  )
}
