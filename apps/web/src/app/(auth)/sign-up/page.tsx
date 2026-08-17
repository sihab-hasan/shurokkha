import type { Metadata } from "next"

import { AuthHeader } from "@shurokkha/ui-patterns/auth"
import { SignUpForm } from "@/components/auth/forms/sign-up-form"
import { GuestGate } from "@/components/auth/guest-gate"

const pageTitle = "Sign Up"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Create a Shurokkha account to request help, volunteer, donate, and coordinate resources.",
}

export default function SignUp() {
  return (
    <GuestGate>
      <div className="flex flex-col gap-7 py-4">
        <AuthHeader
          title="Create your account"
          description="Join one trusted network for requesting help, volunteering, and coordinating relief."
        />
        <SignUpForm />
      </div>
    </GuestGate>
  )
}
