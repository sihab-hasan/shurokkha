import { Card, CardContent } from "@shurokkha/ui/components/card"

import { errorMessage } from "@/features/shared/api-feedback"

interface DisastersErrorStateProps {
  error: unknown
}

/**
 * Error fallback for {@link DisastersSection}. Uses the shared
 * `errorMessage()` extractor so the same shape of failure seen by
 * the rest of the app is rendered here.
 */
export function DisastersErrorState({ error }: DisastersErrorStateProps) {
  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <p className="text-sm font-medium">Could not load disasters</p>
        <p className="text-sm text-muted-foreground">
          {errorMessage(error, "An unexpected error occurred.")}
        </p>
      </CardContent>
    </Card>
  )
}
