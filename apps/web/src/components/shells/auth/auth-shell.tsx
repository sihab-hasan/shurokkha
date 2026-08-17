import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { AuthShell as AuthPatternShell } from "@shurokkha/ui-patterns/auth"
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
    <AuthPatternShell
      story={<AuthStoryPanel />}
      mobileBrand={
        <BrandLogo
          priority
          showTagline={false}
          className="[&_span:nth-child(2)]:hidden"
        />
      }
      backAction={
        <Link
          href="/"
          aria-label="Back to home"
          className={cn(buttonVariants({ variant: "secondary" }), "lg:mr-auto")}
        >
          <ArrowLeft />
          <span className="inline sm:hidden">Back</span>
          <span className="hidden sm:inline">Back to home</span>
        </Link>
      }
      disableMotion
    >
      <Card className="w-full rounded-xl shadow-card">
        <CardContent>{children}</CardContent>
      </Card>
    </AuthPatternShell>
  )
}
