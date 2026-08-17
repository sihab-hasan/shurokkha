import { AppShell } from "@/components/shells/app/app-shell"

export default function CitizenLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppShell role="citizen">{children}</AppShell>
}
