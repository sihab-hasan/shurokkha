"use client"

import { type FormEvent, useState } from "react"
import { CheckCircle2, Send, ShieldCheck } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@shurokkha/ui/components/alert"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { Textarea } from "@shurokkha/ui/components/textarea"

export function ContactForm() {
  const [sent, setSent] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
    event.currentTarget.reset()
  }

  return (
    <Card className="shadow-xs lg:sticky lg:top-28">
      <CardHeader className="space-y-2 pb-3">
        <CardTitle className="font-heading text-2xl">
          Send a message to Shurokkha
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Tell us what you need help with and include only the context necessary
          to understand the enquiry. This form is for Shurokkha support and
          coordination—not emergency dispatch.
        </p>
      </CardHeader>
      <CardContent className="pt-3">
        {sent ? (
          <Alert className="mb-6">
            <CheckCircle2 />
            <AlertTitle>Message recorded in this development build</AlertTitle>
            <AlertDescription>
              The production support workflow still needs to be connected before
              this form can deliver live enquiries.
            </AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-subject">What is this about?</Label>
            <Input
              id="contact-subject"
              name="subject"
              placeholder="For example: account access, partnership, accessibility, safety"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-message">How can we help?</Label>
            <Textarea
              id="contact-message"
              name="message"
              rows={8}
              placeholder="Describe the issue or enquiry, including the relevant area, page, request, or organization if useful."
              required
            />
          </div>

          <div className="rounded-lg bg-muted/45 p-4">
            <div className="flex gap-3">
              <ShieldCheck
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p className="text-sm leading-6 text-muted-foreground">
                Do not send passwords, payment credentials, medical records,
                national identity documents, or other highly sensitive
                information through this general contact form.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              <Send data-icon="inline-start" />
              Send message
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
