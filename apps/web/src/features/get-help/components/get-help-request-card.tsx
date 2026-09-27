import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"

/**
 * Primary CTA card on `/get-help`. Explains that an account is required
 * to track requests, and surfaces the two actions: start a new request
 * and view existing requests.
 */
export function GetHelpRequestCard() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">Request help form</CardTitle>
        <CardDescription>
          You&apos;ll need to be signed in so the request can be tracked against
          your account. We&apos;ll bring you back here when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          The request captures the area, type of help, urgency, contact phone,
          and any details the coordination team needs to assess the situation.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            nativeButton={false}
            size="lg"
            render={<Link href="/account/assistance/new" />}
          >
            Start a request
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            nativeButton={false}
            size="lg"
            variant="outline"
            render={<Link href="/account/assistance" />}
          >
            View existing requests
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
