import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

interface ProfileNotFoundProps {
  username: string
  message: string
}

/**
 * Renders when `/u/{username}` can't load a profile — either because
 * the username doesn't exist or the lookup returned 404. Differs from
 * `notFound()` only because we still want to render the public shell
 * and a contextual message rather than the framework 404 page.
 */
export function ProfileNotFound({ username, message }: ProfileNotFoundProps) {
  return (
    <Section className="py-16">
      <Container>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm font-medium">Profile not available</p>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t load <span className="font-mono">@{username}</span>
              . {message}
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
