"use client"

import Link from "next/link"

import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent } from "@shurokkha/ui/components/card"
import { Skeleton } from "@shurokkha/ui/components/skeleton"

import { useAuth } from "@/components/auth/auth-provider"
import { routes } from "@/config/routes"

import { DonationForm } from "./donation-form"

/**
 * Public-marketing gate around `<DonationForm />`.
 *
 * The backend requires an authenticated session for `POST /v1/donations`
 * (`auth` middleware + `DonationPolicy::create`). Rather than hard-redirect
 * guests away from `/donate`, we keep the marketing content visible and
 * show a sign-in CTA pointing back here via `?next=/donate`.
 *
 * The "checking" branch matters — without it, the initial paint flashes
 * the sign-in CTA before the auth provider resolves the session, then
 * swaps in the form once we know the user is signed in.
 */
export function DonateGate() {
  const { status } = useAuth()

  if (status === "checking") {
    return <DonateSkeleton />
  }

  if (status === "authenticated") {
    return <DonationForm />
  }

  return (
    <Card className="border-info/30 bg-info/5">
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Sign in to donate</p>
          <p className="text-sm text-muted-foreground">
            Donations are recorded against your Shurokkha account so we can
            issue you a receipt and follow up with how your contribution was
            used. Sign in or create an account — we&apos;ll bring you back to
            this page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            nativeButton={false}
            render={
              <Link
                href={`${routes.auth.signIn}?next=${encodeURIComponent("/donate")}`}
              />
            }
          >
            Sign in to donate
          </Button>
          <Button
            type="button"
            variant="ghost"
            nativeButton={false}
            render={
              <Link
                href={`${routes.auth.signUp}?next=${encodeURIComponent("/donate")}`}
              />
            }
          >
            Create an account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function DonateSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
  )
}
