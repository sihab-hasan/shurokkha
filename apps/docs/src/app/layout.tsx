import type { Metadata } from "next"
import "../styles/app.css"
import { Inter, Manrope } from "next/font/google"
import { cn } from "@shurokkha/ui/lib/utils"

import { UiProvider } from "@shurokkha/ui/providers/ui-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const manropeHeading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "Shurokkha Docs",
  description: "Design system and product documentation for Shurokkha",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        manropeHeading.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="flex min-h-full min-w-0 flex-col">
        <UiProvider>{children}</UiProvider>
      </body>
    </html>
  )
}
