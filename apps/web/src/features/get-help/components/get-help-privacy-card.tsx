import Link from "next/link"
import { Lock } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

/**
 * Sidebar privacy card explaining who can see a request and pointing
 * non-disaster queries at the contact page.
 */
export function GetHelpPrivacyCard() {
  return (
    <Card className="bg-muted/35">
      <CardHeader className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Privacy notice
        </p>
        <CardTitle className="text-base">
          We collect only what coordination needs
        </CardTitle>
        <CardDescription className="flex items-start gap-2">
          <Lock
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden
          />
          <span>
            Request details are visible to the coordination team and to you.
            Other citizens never see your private request unless you choose to
            share a public appeal.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm leading-6 text-muted-foreground">
        <p>
          Need help with something other than a disaster request? Use the
          contact form or one of the official helplines listed on the{" "}
          <Link
            className="font-medium text-foreground underline-offset-4 hover:underline"
            href="/contact"
          >
            Contact page
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  )
}
