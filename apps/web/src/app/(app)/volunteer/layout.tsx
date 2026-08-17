import { AppShell } from "@/components/shells/app/app-shell"

export default function VolunteerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppShell role="volunteer">{children}</AppShell>
}
