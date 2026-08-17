import { AdminShell } from "@/components/shells/admin/admin-shell"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AdminShell>{children}</AdminShell>
}
