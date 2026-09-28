import type { Metadata } from "next"
import { Inter, Manrope } from "next/font/google"

import { Toaster } from "@shurokkha/ui/components/sonner"
import { cn } from "@shurokkha/ui/lib/utils"
import { UiProvider } from "@shurokkha/ui/providers/ui-provider"

import { AuthProvider } from "@/components/auth/auth-provider"
import { ThemeInitScript } from "@/components/theme-init-script"
import { QueryProvider } from "@/components/providers/query-provider"

import "../styles/app.css"

const manropeHeading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    default: "Shurokkha Admin",
    template: "%s | Shurokkha Admin",
  },
  description:
    "Shurokkha admin console for managing emergency response operations, volunteers, shelters, and resources.",
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
        "h-full antialiased",
        "font-sans",
        inter.variable,
        manropeHeading.variable
      )}
    >
      <body className="flex min-h-full min-w-0 flex-col">
        <ThemeInitScript />
        <UiProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster richColors closeButton position="bottom-right" />
            </AuthProvider>
          </QueryProvider>
        </UiProvider>
      </body>
    </html>
  )
}
