import type { Metadata } from "next"
import Link from "next/link"

import { AuthHeader } from "@shurokkha/ui-patterns/auth"
import { SignInForm } from "@/components/auth/forms/sign-in-form"
import { GuestGate } from "@/components/auth/guest-gate"

import { routes } from "@/config/routes"

const pageTitle = "Sign In"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Sign in to your Shurokkha account to access emergency response tools and resources.",
}

export default function SignIn() {
  return (
    <GuestGate>
      <div className="flex flex-col gap-7">
        <AuthHeader
          title="Welcome back"
          description="Sign in to coordinate help, access trusted resources, and stay connected when it matters most."
        />
        <SignInForm />
        <p className="text-center text-sm text-muted-foreground">
          New to Shurokkha?{" "}
          <Link
            href={routes.auth.signUp}
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </GuestGate>
  )
}
