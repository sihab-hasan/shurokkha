import { LoadingState } from "@shurokkha/ui-patterns/feedback"

export default function WorkspaceLoading() {
  return <LoadingState variant="skeleton" lines={8} label="Loading workspace" />
}
