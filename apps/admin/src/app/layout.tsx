import type { Metadata } from "next"
import "../styles/app.css"

export const metadata: Metadata = {
  title: "Shurokkha Admin",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
