import { Spinner } from "../components/spinner"
import { Container } from "./container"
import { Section } from "./section"

export function PageLoader() {
  return (
    <Section className="flex min-h-[50vh] flex-col justify-center">
      <Container className="flex justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </Container>
    </Section>
  )
}
