import { PublicShell } from "@/components/shells/public/public-shell"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PublicShell>{children}</PublicShell>
}
