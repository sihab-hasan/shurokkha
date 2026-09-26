import type { Metadata } from "next"
import "../styles/app.css"
import { Inter, Manrope } from "next/font/google"
import { cn } from "@shurokkha/ui/lib/utils"
import { Toaster } from "@shurokkha/ui/components/sonner"
import { UiProvider } from "@shurokkha/ui/providers/ui-provider"
import { CommandPalette } from "@/components/command/command-palette"
import { QueryProvider } from "@/components/providers/query-provider"
import { ThemeInitScript } from "@/components/theme-init-script"
import { AuthProvider } from "@/components/auth/auth-provider"

const manropeHeading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    default: "Shurokkha",
    template: "%s | Shurokkha",
  },
  description:
    "Shurokkha is a disaster relief and resource management platform for emergency response, shelters, volunteers, donations, and resource coordination.",
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
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
          <AuthProvider>
            {/* QueryProvider wraps both the main children tree and the
                @modal parallel-route slot so intercepting routes (e.g.
                the "new assistance request" modal) can call useMutation
                hooks that depend on the shared QueryClient. */}
            <QueryProvider>
              <CommandPalette />
              {children}
              {modal}
              <Toaster richColors closeButton position="bottom-right" />
            </QueryProvider>
          </AuthProvider>
        </UiProvider>
      </body>
    </html>
  )
}
