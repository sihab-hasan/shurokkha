import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { buttonVariants } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"
import { cn } from "@shurokkha/ui/lib/utils"

import { AuthStoryPanel } from "@/components/auth/auth-story-panel"
import { BrandLogo } from "@/components/brand/brand-logo"

export interface AuthShellProps {
  children: ReactNode
}

/** Authentication experience chrome shared by sign-in, registration and recovery routes. */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <AuthStoryPanel />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between gap-2">
          <BrandLogo priority showTagline={false} />
          <Link
            href="/"
            aria-label="Back to home"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            <ArrowLeft className="mr-2 size-4" />
            <span className="inline sm:hidden">Back</span>
            <span className="hidden sm:inline">Back to home</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="w-full rounded-xl shadow-card">
              <CardContent className="pt-6">{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
