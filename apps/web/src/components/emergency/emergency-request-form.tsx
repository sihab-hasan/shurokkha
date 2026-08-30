"use client"

import * as React from "react"
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  LifeBuoy,
  Phone,
  Send,
  ShieldAlert,
  User,
} from "lucide-react"

import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"
import { Textarea } from "@shurokkha/ui/components/textarea"

export interface EmergencyRequestSubmission {
  user_id: number
  category_id: number
  priority: "critical" | "high" | "normal" | "low"
  status: "pending" | "in_progress" | "rescued" | "closed"
  request_at: string
  details?: string
  contact_phone?: string
}

export function EmergencyRequestForm() {
  const [userId, setUserId] = React.useState<number>(2)
  const [categoryId, setCategoryId] = React.useState<number>(1)
  const [priority, setPriority] = React.useState<
    "critical" | "high" | "normal" | "low"
  >("critical")
  const [contactPhone, setContactPhone] = React.useState("01711223344")
  const [details, setDetails] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submittedRequest, setSubmittedRequest] =
    React.useState<EmergencyRequestSubmission | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const newRequest: EmergencyRequestSubmission = {
        user_id: userId,
        category_id: categoryId,
        priority,
        status: "pending",
        request_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        details,
        contact_phone: contactPhone,
      }
      setSubmittedRequest(newRequest)
      setIsSubmitting(false)
    }, 600)
  }

  const categoryNames: Record<number, string> = {
    1: "Rescue & Emergency Evacuation",
    2: "Critical Medical Attention",
    3: "Food, Potable Water & Rations",
    4: "Temporary Shelter Allocation",
    5: "Emergency Logistics & Aid",
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Alert Header */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div className="text-sm">
            <h3 className="font-semibold">Life-Threatening Emergency Notice</h3>
            <p className="mt-1 text-xs opacity-90">
              For immediate dispatch during active floods or storm surges,
              submit your emergency request below. Data directly synchronizes
              with table{" "}
              <code className="font-mono font-bold">emergency_requests</code>.
            </p>
          </div>
        </div>
      </div>

      {submittedRequest ? (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
              <CardTitle className="text-lg">
                Emergency Request Registered!
              </CardTitle>
            </div>
            <CardDescription>
              Your dispatch request has been saved with status{" "}
              <strong>pending</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/80 bg-card p-4">
              <div>
                <span className="text-xs text-muted-foreground">
                  Request Category:
                </span>
                <p className="font-medium">
                  {categoryNames[submittedRequest.category_id]}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Urgency Priority:
                </span>
                <p>
                  <Badge
                    variant={
                      submittedRequest.priority === "critical"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {submittedRequest.priority}
                  </Badge>
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  User ID (Submitter):
                </span>
                <p className="font-mono">User #{submittedRequest.user_id}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Registered Timestamp:
                </span>
                <p className="font-mono text-xs">
                  {submittedRequest.request_at}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSubmittedRequest(null)}
            >
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/80 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-primary" />
              <CardTitle>Submit Emergency Help Request</CardTitle>
            </div>
            <CardDescription>
              Mapped directly to ERD Table:{" "}
              <code className="font-mono font-semibold">
                emergency_requests
              </code>{" "}
              (request_id, user_id, category_id, priority, status, request_at).
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Select */}
              <div className="space-y-2">
                <Label htmlFor="category_id">
                  Emergency Category (category_id)
                </Label>
                <NativeSelect
                  id="category_id"
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full"
                >
                  <NativeSelectOption value="1">
                    1 - Rescue & Evacuation
                  </NativeSelectOption>
                  <NativeSelectOption value="2">
                    2 - Critical Medical Need
                  </NativeSelectOption>
                  <NativeSelectOption value="3">
                    3 - Food & Clean Water Rations
                  </NativeSelectOption>
                  <NativeSelectOption value="4">
                    4 - Emergency Shelter Need
                  </NativeSelectOption>
                  <NativeSelectOption value="5">
                    5 - General Relief Aid
                  </NativeSelectOption>
                </NativeSelect>
              </div>

              {/* Priority Select */}
              <div className="space-y-2">
                <Label htmlFor="priority">Urgency Priority (priority)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(["critical", "high", "normal", "low"] as const).map((p) => (
                    <Button
                      key={p}
                      type="button"
                      variant={priority === p ? "default" : "outline"}
                      className={`capitalize ${
                        priority === p && p === "critical"
                          ? "text-destructive-foreground bg-destructive hover:bg-destructive/90"
                          : ""
                      }`}
                      onClick={() => setPriority(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>

              {/* User ID & Contact Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="user_id">Submitter User ID (user_id)</Label>
                  <Input
                    id="user_id"
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                  />
                </div>
              </div>

              {/* Situation Details */}
              <div className="space-y-2">
                <Label htmlFor="details">Situation Description</Label>
                <Textarea
                  id="details"
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe your current condition, number of trapped individuals, and nearest landmarks..."
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2 text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Registering Request…"
                ) : (
                  <>
                    <Send className="size-4" />
                    Submit Emergency Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
