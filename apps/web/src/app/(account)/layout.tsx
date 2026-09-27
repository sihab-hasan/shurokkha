import { AccountShell } from "@/components/shells/account/account-shell"

/**
 * Unified RBAC Account Layout supporting parallel @modal intercepting routes.
 *
 * QueryProvider lives at the root layout (src/app/layout.tsx) so the @modal
 * slot — which intercepts routes like `/account/assistance/new` as a modal —
 * shares the same QueryClient as the underlying page.
 *
 * The layout MUST accept and render the `modal` parallel slot. If it only
 * renders `children`, Next.js can't satisfy the parallel slot contract and
 * intercepting routes fall back to full-page navigation.
 */
export default function AccountLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <AccountShell>
      {children}
      {modal}
    </AccountShell>
  )
}
