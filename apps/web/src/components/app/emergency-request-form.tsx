"use client"

import * as React from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Send,
  ShieldAlert,
  User,
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
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { Badge } from "@shurokkha/ui/components/badge"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"

interface EmergencyRequestItem {
  id: number
  user_name: string
  phone_number: string
  shelter_id: number | null
  disaster_type_id: number | null
  status: string
  created_at: string
}

export function EmergencyRequestForm() {
  const [formData, setFormData] = React.useState({
    user_name: "",
    phone_number: "",
    disaster_type_id: "1",
    shelter_id: "1",
    status: "Pending",
  })

  const [loading, setLoading] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [recentRequests, setRecentRequests] = React.useState<
    EmergencyRequestItem[]
  >([])
  const [fetchingList, setFetchingList] = React.useState(false)

  const fetchRequests = React.useCallback(async () => {
    setFetchingList(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/api/emergency-requests")
      if (res.ok) {
        const data = await res.json()
        setRecentRequests(data)
      }
    } catch {
      // Backend might be offline or loading
    } finally {
      setFetchingList(false)
    }
  }, [])

  React.useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const payload = {
        user_name: formData.user_name,
        phone_number: formData.phone_number,
        disaster_type_id: parseInt(formData.disaster_type_id, 10),
        shelter_id: parseInt(formData.shelter_id, 10),
        status: formData.status,
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/emergency-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      const result = await response.json()

      if (response.ok) {
        setSuccessMessage(
          "✅ Emergency request submitted & inserted into database successfully!"
        )
        setFormData({
          user_name: "",
          phone_number: "",
          disaster_type_id: "1",
          shelter_id: "1",
          status: "Pending",
        })
        fetchRequests()
      } else {
        setErrorMessage(result.message || "Failed to submit request")
      }
    } catch (err) {
      setErrorMessage(
        "Connection to Backend API failed. Please ensure backend is running."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
      {/* Form Area */}
      <Card className="border-destructive/20 shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            <CardTitle className="text-xl">Submit Emergency Request</CardTitle>
          </div>
          <CardDescription>
            Fill in the information below to send an emergency rescue/relief
            request directly to the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert className="mb-4 border-destructive/30 bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="req-name">Full Name / Contact Person</Label>
              <div className="relative">
                <Input
                  id="req-name"
                  placeholder="e.g. Rahim Uddin"
                  value={formData.user_name}
                  onChange={(e) =>
                    setFormData({ ...formData, user_name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="req-phone">Emergency Phone Number</Label>
              <Input
                id="req-phone"
                type="tel"
                placeholder="e.g. 01711223344"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="req-disaster">Disaster Type</Label>
                <NativeSelect
                  id="req-disaster"
                  value={formData.disaster_type_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      disaster_type_id: e.target.value,
                    })
                  }
                  className="w-full"
                >
                  <option value="1">1 - Flood (High)</option>
                  <option value="2">2 - Cyclone (Critical)</option>
                  <option value="3">3 - Earthquake (Critical)</option>
                  <option value="4">4 - Fire (Medium)</option>
                  <option value="5">5 - Landslide (High)</option>
                </NativeSelect>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="req-shelter">Target Shelter</Label>
                <NativeSelect
                  id="req-shelter"
                  value={formData.shelter_id}
                  onChange={(e) =>
                    setFormData({ ...formData, shelter_id: e.target.value })
                  }
                  className="w-full"
                >
                  <option value="1">1 - Gowainghat Primary School</option>
                  <option value="2">2 - Tahirpur Upazila Complex</option>
                  <option value="3">3 - Chilmari Flood Shelter</option>
                  <option value="4">4 - Shyamnagar Cyclone Center</option>
                </NativeSelect>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="req-status">Initial Urgency Status</Label>
              <NativeSelect
                id="req-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full"
              >
                <option value="Pending">Pending (Awaiting Response)</option>
                <option value="In Progress">In Progress (Dispatching)</option>
                <option value="Rescued">Rescued (Safe)</option>
              </NativeSelect>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="text-destructive-foreground w-full gap-2 bg-destructive hover:bg-destructive/90"
            >
              {loading ? (
                "Submitting to Database..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Emergency Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Live Table Feed from Database */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Live Database Records
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRequests}
              disabled={fetchingList}
              className="h-8 text-xs"
            >
              {fetchingList ? "Refreshing..." : "Refresh DB"}
            </Button>
          </div>
          <CardDescription className="text-xs">
            Live rows from `emergency_requests` table in MySQL
            (`disaster_relief`).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentRequests.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No emergency requests found or backend is offline.
            </p>
          ) : (
            <div className="max-h-[380px] space-y-2.5 overflow-y-auto pr-1">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col gap-1 rounded-lg border bg-card/60 p-3 text-xs shadow-xs transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1.5 font-semibold text-foreground">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.user_name}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        req.status === "Rescued"
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : req.status === "In Progress"
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }
                    >
                      {req.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {req.phone_number}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      ID #{req.id} · {req.created_at}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
