import { LoadingState } from "@shurokkha/ui/components/states"

export default function AuthLoading() {
  return (
    <LoadingState
      variant="skeleton"
      lines={4}
      label="Loading secure access"
      className="border-0 p-0"
    />
  )
}
