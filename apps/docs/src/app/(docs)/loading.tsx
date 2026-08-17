import { LoadingState } from "@shurokkha/ui-patterns/feedback"

export default function DocumentationLoading() {
  return (
    <LoadingState variant="skeleton" lines={7} label="Loading documentation" />
  )
}
