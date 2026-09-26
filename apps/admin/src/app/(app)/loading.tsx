import { LoadingState } from "@shurokkha/ui/components/states"

export default function WorkspaceLoading() {
  return <LoadingState variant="skeleton" lines={8} label="Loading workspace" />
}
