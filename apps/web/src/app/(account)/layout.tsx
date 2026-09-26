import { AccountShell } from "@/components/shells/account/account-shell"

/**
 * Unified RBAC Account Layout supporting parallel @modal intercepting routes.
 *
 * QueryProvider lives at the root layout (src/app/layout.tsx) so the @modal
 * slot — which intercepts routes like `/account/assistance/new` as a modal —
 * shares the same QueryClient as the underlying page.
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AccountShell>{children}</AccountShell>
}
