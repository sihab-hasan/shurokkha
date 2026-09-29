"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  Database,
  FunctionSquare,
  ListTree,
  Workflow,
} from "lucide-react"

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
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"
import { toast } from "@shurokkha/ui/components/sonner"

import { adminRoutes } from "@/config/routes"
import { getShurokkhaApi } from "@/lib/api"

import {
  severityBadgeClass,
  statusBadgeClass,
} from "@/components/operations/badges"

type Tab = "view" | "union" | "procedure" | "transaction"

const TABS: {
  key: Tab
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { key: "view", label: "View", icon: Database },
  { key: "union", label: "Union", icon: ListTree },
  { key: "procedure", label: "Procedure", icon: FunctionSquare },
  { key: "transaction", label: "Transaction", icon: Workflow },
]

interface ViewState {
  view: Array<Record<string, unknown>>
  union: Array<Record<string, unknown>>
  procedure: unknown
  transaction: unknown
  loading: boolean
  setView: (rows: Array<Record<string, unknown>>) => void
  setUnion: (rows: Array<Record<string, unknown>>) => void
  setProcedure: (result: unknown) => void
  setTransaction: (result: unknown) => void
  setLoading: (loading: boolean) => void
}

export default function ReportsTvupPage() {
  const api = getShurokkhaApi()
  const [tab, setTab] = useState<Tab>("view")

  const [view, setView] = useState<Array<Record<string, unknown>>>([])
  const [union, setUnion] = useState<Array<Record<string, unknown>>>([])
  const [procedure, setProcedure] = useState<unknown>(null)
  const [transaction, setTransaction] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)

  const state: ViewState = {
    view,
    union,
    procedure,
    transaction,
    loading,
    setView,
    setUnion,
    setProcedure,
    setTransaction,
    setLoading,
  }

  return (
    <Section className="py-8 sm:py-10">
      <Container className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit"
          nativeButton={false}
          render={<Link href={adminRoutes.reports.list} />}
        >
          <ArrowLeft className="size-4" /> Back to Reports
        </Button>

        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            TVUP Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Interactive demonstrations of Transaction, View, Union, and
            Procedure SQL objects.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.key
            return (
              <Button
                key={t.key}
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => setTab(t.key)}
              >
                <Icon className="size-4" /> {t.label}
              </Button>
            )
          })}
        </div>

        {tab === "view" ? <ViewTab state={state} api={api} /> : null}
        {tab === "union" ? <UnionTab state={state} api={api} /> : null}
        {tab === "procedure" ? <ProcedureTab state={state} api={api} /> : null}
        {tab === "transaction" ? (
          <TransactionTab state={state} api={api} />
        ) : null}
      </Container>
    </Section>
  )
}

function ViewTab({
  state,
  api,
}: {
  state: ViewState
  api: ReturnType<typeof getShurokkhaApi>
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">
          VIEW — user_emergency_history
        </CardTitle>
        <CardDescription>
          Joined view exposing each user&apos;s emergency requests alongside
          their disaster and area.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          size="sm"
          disabled={state.loading}
          onClick={async () => {
            try {
              state.setLoading(true)
              const res = await api.core.tvup.userEmergencyHistory()
              state.setView(
                (res.data ?? []) as unknown as Array<Record<string, unknown>>
              )
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Failed to load view"
              )
            } finally {
              state.setLoading(false)
            }
          }}
        >
          Load View
        </Button>

        {state.view.length > 0 ? (
          <pre className="max-h-96 overflow-auto rounded-md bg-muted/40 p-3 font-mono text-xs">
            {JSON.stringify(state.view, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click "Load View" to fetch user_emergency_history.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function UnionTab({
  state,
  api,
}: {
  state: ViewState
  api: ReturnType<typeof getShurokkhaApi>
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">UNION — critical alerts</CardTitle>
        <CardDescription>
          Combined list of every critical or severe alert across all disasters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          size="sm"
          disabled={state.loading}
          onClick={async () => {
            try {
              state.setLoading(true)
              const res = await api.core.tvup.criticalAlerts()
              state.setUnion(
                (res.data ?? []) as unknown as Array<Record<string, unknown>>
              )
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Failed to load union"
              )
            } finally {
              state.setLoading(false)
            }
          }}
        >
          Load Union
        </Button>

        {state.union.length > 0 ? (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs">Title</th>
                  <th className="px-3 py-2 text-left text-xs">Disaster</th>
                  <th className="px-3 py-2 text-left text-xs">Severity</th>
                  <th className="px-3 py-2 text-left text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.union.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-3 py-2 font-medium">
                      {(row.title as string) ?? `Alert #${row.alert_id}`}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {(row.disaster_name as string) ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        variant="outline"
                        className={severityBadgeClass(
                          (row.severity as string) ?? ""
                        )}
                      >
                        {(row.severity as string) ?? "—"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        variant="outline"
                        className={statusBadgeClass(
                          (row.status as string) ?? ""
                        )}
                      >
                        {(row.status as string) ?? "—"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click "Load Union" to fetch critical alerts.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function ProcedureTab({
  state,
  api,
}: {
  state: ViewState
  api: ReturnType<typeof getShurokkhaApi>
}) {
  const [disasterId, setDisasterId] = useState("")
  const [severity, setSeverity] = useState<
    "low" | "moderate" | "high" | "severe" | "critical"
  >("severe")

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">
          PROCEDURE — sp_escalate_disaster_and_requests
        </CardTitle>
        <CardDescription>
          Escalate a disaster&apos;s severity and re-classify all related
          emergency requests in a single transaction.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="disaster_id">Disaster ID</Label>
            <Input
              id="disaster_id"
              type="number"
              value={disasterId}
              onChange={(e) => setDisasterId(e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new_severity">New Severity</Label>
            <NativeSelect
              id="new_severity"
              value={severity}
              onChange={(e) =>
                setSeverity(
                  e.target.value as
                    "low" | "moderate" | "high" | "severe" | "critical"
                )
              }
            >
              <option value="low">low</option>
              <option value="moderate">moderate</option>
              <option value="high">high</option>
              <option value="severe">severe</option>
              <option value="critical">critical</option>
            </NativeSelect>
          </div>
        </div>
        <Button
          size="sm"
          disabled={state.loading || !disasterId}
          onClick={async () => {
            try {
              state.setLoading(true)
              const res = await api.core.tvup.escalateDisaster({
                disaster_id: Number(disasterId),
                new_severity: severity,
              })
              state.setProcedure(res.data)
              toast.success("Disaster escalated.")
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Procedure failed"
              )
            } finally {
              state.setLoading(false)
            }
          }}
        >
          Run Procedure
        </Button>

        {state.procedure ? (
          <pre className="max-h-72 overflow-auto rounded-md bg-muted/40 p-3 font-mono text-xs">
            {JSON.stringify(state.procedure, null, 2)}
          </pre>
        ) : null}
      </CardContent>
    </Card>
  )
}

function TransactionTab({
  state,
  api,
}: {
  state: ViewState
  api: ReturnType<typeof getShurokkhaApi>
}) {
  const [disasterName, setDisasterName] = useState("")
  const [severity, setSeverity] = useState("moderate")
  const [areaName, setAreaName] = useState("")
  const [population, setPopulation] = useState("")
  const [userId, setUserId] = useState("")
  const [description, setDescription] = useState("")

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">
          TRANSACTION — report_disaster_and_emergency
        </CardTitle>
        <CardDescription>
          Atomic multi-table insert: creates a disaster, an affected area, and
          an emergency request for a citizen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="disaster_name">Disaster Name *</Label>
            <Input
              id="disaster_name"
              value={disasterName}
              onChange={(e) => setDisasterName(e.target.value)}
              placeholder="Ctg Cyclone"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="severity">Severity</Label>
            <NativeSelect
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="low">low</option>
              <option value="moderate">moderate</option>
              <option value="high">high</option>
              <option value="severe">severe</option>
              <option value="critical">critical</option>
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="area_name">Area Name *</Label>
            <Input
              id="area_name"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              placeholder="Patiya Upazila"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="affected_population">Affected Population *</Label>
            <Input
              id="affected_population"
              type="number"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
              placeholder="5000"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user_id">Reporting User ID *</Label>
            <Input
              id="user_id"
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="2"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Trapped rooftop, need evacuation."
            />
          </div>
        </div>

        <Button
          size="sm"
          disabled={
            state.loading ||
            !disasterName ||
            !areaName ||
            !population ||
            !userId ||
            !description
          }
          onClick={async () => {
            try {
              state.setLoading(true)
              const res = await api.core.tvup.reportDisasterAndEmergency({
                disaster_name: disasterName,
                severity,
                area_name: areaName,
                affected_population: Number(population),
                user_id: Number(userId),
                description,
                priority: "high",
              })
              state.setTransaction(res.data)
              toast.success("Transaction committed.")
              setDisasterName("")
              setAreaName("")
              setPopulation("")
              setDescription("")
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Transaction failed"
              )
            } finally {
              state.setLoading(false)
            }
          }}
        >
          Run Transaction
        </Button>

        {state.transaction ? (
          <pre className="max-h-72 overflow-auto rounded-md bg-muted/40 p-3 font-mono text-xs">
            {JSON.stringify(state.transaction, null, 2)}
          </pre>
        ) : null}
      </CardContent>
    </Card>
  )
}
