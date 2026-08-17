import { LoadingState } from "@shurokkha/ui-patterns/feedback"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"

export default function PublicLoading() {
  return (
    <ContentContainer className="py-12">
      <LoadingState variant="skeleton" lines={7} label="Loading page" />
    </ContentContainer>
  )
}
