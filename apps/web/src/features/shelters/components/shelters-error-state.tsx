import { Card, CardContent } from "@shurokkha/ui/components/card"

import { errorMessage } from "@/features/shared/api-feedback"

interface SheltersErrorStateProps {
  error: unknown
}

/**
 * Error fallback for {@link SheltersSection}.
 */
export function SheltersErrorState({ error }: SheltersErrorStateProps) {
  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <p className="text-sm font-medium">Could not load shelters</p>
        <p className="text-sm text-muted-foreground">
          {errorMessage(error, "An unexpected error occurred.")}
        </p>
      </CardContent>
    </Card>
  )
}
