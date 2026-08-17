import { DocsShell } from "@/components/shells/docs/docs-shell"

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DocsShell>{children}</DocsShell>
}
