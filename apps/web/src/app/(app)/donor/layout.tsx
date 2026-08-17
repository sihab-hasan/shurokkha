import { AppShell } from "@/components/shells/app/app-shell"

export default function DonorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppShell role="donor">{children}</AppShell>
}
