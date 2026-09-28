"use client"

import { useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Loader2,
  Sparkles,
} from "lucide-react"

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
import { getApiBaseUrl } from "@/lib/api"

export function QuickDisasterTransactionCard({
  onSuccess,
}: {
  onSuccess?: () => void
}) {
  const [disasterName, setDisasterName] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    success: boolean
    message: string
    disasterId?: number
    areaId?: number
  } | null>(null)

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!disasterName.trim()) return

    setLoading(true)
    setStatus(null)

    try {
      const baseUrl = getApiBaseUrl()
      const res = await fetch(`${baseUrl}/v1/core/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          disaster_name: disasterName.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(
          data.message || data.error_details || "Transaction failed"
        )
      }

      setStatus({
        success: true,
        message:
          data.message ||
          "Disaster, Area, and Emergency Request saved together.",
        disasterId: data.new_disaster_id,
        areaId: data.new_area_id,
      })
      setDisasterName("")
      onSuccess?.()
    } catch (err: any) {
      setStatus({
        success: false,
        message:
          err.message || "Atomic transaction rolled back. No data was saved.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-primary/30 bg-primary/[0.02] shadow-sm">
      <CardHeader className="space-y-1 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Database className="size-4" />
          </span>
          <CardTitle className="text-lg font-bold tracking-tight">
            Report New Disaster with Emergency Request
          </CardTitle>
        </div>
        <CardDescription>
          Executes an <strong>Atomic Transaction</strong> across 3 database
          tables: creates a <code>Disaster</code>, links an{" "}
          <code>Affected Area</code>, and files the citizen&apos;s{" "}
          <code>Emergency Request</code> concurrently with rollback protection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTransactionSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="atomic-disaster-name" className="text-sm">
              Disaster Title / Event Description
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="atomic-disaster-name"
                placeholder="e.g. Flash Flood Sunamganj or Severe Storm Bogura"
                value={disasterName}
                onChange={(e) => setDisasterName(e.target.value)}
                disabled={loading}
                className="flex-1"
                required
              />
              <Button
                type="submit"
                disabled={loading || !disasterName.trim()}
                className="shrink-0 gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Committing...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Submit Atomic Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {status && (
          <div
            className={`mt-4 flex items-start gap-2.5 rounded-md p-3 text-xs ${
              status.success
                ? "border border-success/20 bg-success/10 text-success"
                : "border border-danger/20 bg-danger/10 text-danger"
            }`}
          >
            {status.success ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
            ) : (
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">{status.message}</p>
              {status.disasterId && (
                <p className="text-[11px] opacity-90">
                  Database commit confirmed: Created Disaster #
                  {status.disasterId} and Area #{status.areaId}.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
