import type { Metadata } from "next"
import "../styles/app.css"
import { Inter, Manrope } from "next/font/google"
import { cn } from "@shurokkha/ui/lib/utils"
import { UiProvider } from "@shurokkha/ui/providers/ui-provider"

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
        <UiProvider>{children}</UiProvider>
      </body>
    </html>
  )
}
