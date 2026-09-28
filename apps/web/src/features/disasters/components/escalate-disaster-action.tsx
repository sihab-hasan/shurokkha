"use client"

import { useState } from "react"
import { AlertTriangle, ArrowUpRight, CheckCircle2, Loader2, Zap } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"
import { getApiBaseUrl } from "@/lib/api"

export function EscalateDisasterAction({
  disasters = [],
  onEscalated,
}: {
  disasters?: Array<{ disaster_id: number; disaster_name: string; severity?: string | null }>
  onEscalated?: () => void
}) {
  const [selectedId, setSelectedId] = useState<string>(
    disasters[0]?.disaster_id ? String(disasters[0].disaster_id) : "1"
  )
  const [severity, setSeverity] = useState<string>("critical")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleEscalate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const baseUrl = getApiBaseUrl()
      const res = await fetch(`${baseUrl}/v1/core/procedure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disaster_id: Number(selectedId),
          new_severity: severity,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to escalate disaster")
      }

      setResult({
        success: true,
        message: data.message || "Severity successfully escalated via Stored Procedure.",
      })
      onEscalated?.()
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || "An error occurred while executing procedure",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-warning/40 bg-warning/[0.02] shadow-sm">
      <CardHeader className="space-y-1 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
            <Zap className="size-4 text-warning" />
          </span>
          <CardTitle className="text-lg font-bold tracking-tight">
            Escalate Disaster Severity & Emergency Queue
          </CardTitle>
        </div>
        <CardDescription>
          Executes stored procedure <code className="text-xs font-mono font-bold bg-muted px-1.5 py-0.5 rounded">sp_escalate_disaster_and_requests</code> to elevate disaster severity and automatically upgrade all pending citizen requests to Critical.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEscalate} className="flex flex-wrap items-center gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Select Disaster
            </label>
            <NativeSelect
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={loading}
              className="w-full text-sm"
            >
              {disasters.length > 0 ? (
                disasters.map((d) => (
                  <NativeSelectOption key={d.disaster_id} value={String(d.disaster_id)}>
                    #{d.disaster_id} - {d.disaster_name} ({d.severity || "Current"})
                  </NativeSelectOption>
                ))
              ) : (
                <>
                  <NativeSelectOption value="1">#1 - Flash Flood Sylhet</NativeSelectOption>
                  <NativeSelectOption value="2">#2 - Cyclone Remal</NativeSelectOption>
                </>
              )}
            </NativeSelect>
          </div>

          <div className="w-44">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              New Severity
            </label>
            <NativeSelect
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              disabled={loading}
              className="w-full text-sm"
            >
              <NativeSelectOption value="critical">Critical</NativeSelectOption>
              <NativeSelectOption value="severe">Severe</NativeSelectOption>
              <NativeSelectOption value="high">High</NativeSelectOption>
              <NativeSelectOption value="moderate">Moderate</NativeSelectOption>
            </NativeSelect>
          </div>

          <div className="pt-5">
            <Button
              type="submit"
              disabled={loading}
              variant="default"
              className="gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <ArrowUpRight className="size-4" />
                  Escalate Severity
                </>
              )}
            </Button>
          </div>
        </form>

        {result && (
          <div
            className={`mt-4 rounded-md p-3 text-xs flex items-start gap-2 ${
              result.success
                ? "bg-success/10 text-success border border-success/20"
                : "bg-danger/10 text-danger border border-danger/20"
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="size-4 shrink-0 text-success" />
            ) : (
              <AlertTriangle className="size-4 shrink-0 text-danger" />
            )}
            <p className="font-medium">{result.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
