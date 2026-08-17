import { LoadingState } from "@shurokkha/ui-patterns/feedback"

export function AppRouteLoading() {
  return <LoadingState variant="skeleton" lines={8} label="Loading workspace" />
}
