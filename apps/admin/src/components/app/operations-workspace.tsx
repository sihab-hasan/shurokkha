"use client"

import * as React from "react"
import {
  AlertTriangle,
  Flame,
  Activity,
  Users,
  MapPin,
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle,
  Truck,
  HelpCircle,
  Calendar,
  Layers,
  WifiOff,
} from "lucide-react"
import { toast } from "sonner"

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
import { MetricStrip, MetricStripItem } from "@shurokkha/ui-patterns/dashboard"
import { getShurokkhaApi } from "@/lib/api"

// --- TYPE DEFINITIONS ---
interface Disaster {
  disaster_id: number
  disaster_name: string
}

interface AffectedArea {
  area_id: number
  disaster_id: number
  location_id: number
  affected_population: number
  severity: "Critical" | "High" | "Medium" | "Low"
}

interface RescueTeam {
  team_id: number
  team_name: string
  team_type: string
  availability: "available" | "busy" | "offline"
}

interface TeamAssignment {
  assignment_id: number
  team_id: number
  request_id: number
  status: "assigned" | "on_route" | "completed" | "cancelled"
  assignment_at: string
}

interface EmergencyRequest {
  request_id: number
  user_id: number
  priority: string
  status: string
}

export function OperationsWorkspace() {
  // --- MOCK FALLBACK DATA ---
  const initialDisasters: Disaster[] = [
    { disaster_id: 1, disaster_name: "Sylhet Flash Flood 2026" },
    { disaster_id: 2, disaster_name: "Bay of Bengal Super Cyclone" },
    { disaster_id: 3, disaster_name: "Kurigram Riverbank Erosion" },
    { disaster_id: 4, disaster_name: "Chittagong Hill Tracts Landslide" },
  ]

  const emergencyRequests: EmergencyRequest[] = [
    { request_id: 1, user_id: 2, priority: "critical", status: "in_progress" },
    { request_id: 2, user_id: 3, priority: "critical", status: "pending" },
    { request_id: 3, user_id: 2, priority: "high", status: "rescued" },
    { request_id: 4, user_id: 3, priority: "normal", status: "closed" },
  ]

  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = React.useState<
    "areas" | "teams" | "assignments"
  >("areas")
  const [isOffline, setIsOffline] = React.useState(false)

  // Lists
  const [disastersList, setDisastersList] =
    React.useState<Disaster[]>(initialDisasters)
  const [affectedAreas, setAffectedAreas] = React.useState<AffectedArea[]>([])
  const [rescueTeams, setRescueTeams] = React.useState<RescueTeam[]>([])
  const [assignments, setAssignments] = React.useState<TeamAssignment[]>([])

  // Form Inputs
  const [areaForm, setAreaForm] = React.useState({
    disaster_id: 1,
    location_id: "",
    affected_population: "",
    severity: "Medium" as AffectedArea["severity"],
  })

  const [teamForm, setTeamForm] = React.useState({
    team_name: "",
    team_type: "Search and Rescue",
    availability: "available" as RescueTeam["availability"],
  })

  const [assignmentForm, setAssignmentForm] = React.useState({
    team_id: 1,
    request_id: 1,
    status: "assigned" as TeamAssignment["status"],
  })

  // --- API CALLS ---
  const api = React.useMemo(() => getShurokkhaApi(), [])

  const fetchBackendData = React.useCallback(async () => {
    try {
      const [disastersRes, areasRes, teamsRes, assignmentsRes] =
        await Promise.all([
          api.admin.disasters.list(),
          api.admin.affectedAreas.list(),
          api.admin.rescueTeams.list(),
          api.admin.assignments.list(),
        ])

      setDisastersList(
        disastersRes.data.length > 0 ? disastersRes.data : initialDisasters
      )
      setAffectedAreas(areasRes.data)
      setRescueTeams(teamsRes.data)
      setAssignments(
        assignmentsRes.data.map((as) => ({
          ...as,
          assignment_at: as.assignment_at
            ? as.assignment_at.slice(0, 16).replace("T", " ")
            : "",
        }))
      )
      setIsOffline(false)
    } catch (err) {
      console.warn(
        "Backend API not reachable. Falling back to local offline mock storage.",
        err
      )
      setIsOffline(true)
      // Populate local state with mock seeds for zero-error display
      setAffectedAreas([
        {
          area_id: 1,
          disaster_id: 1,
          location_id: 101,
          affected_population: 25000,
          severity: "Critical",
        },
        {
          area_id: 2,
          disaster_id: 1,
          location_id: 102,
          affected_population: 18000,
          severity: "High",
        },
        {
          area_id: 3,
          disaster_id: 2,
          location_id: 201,
          affected_population: 50000,
          severity: "Critical",
        },
        {
          area_id: 4,
          disaster_id: 3,
          location_id: 301,
          affected_population: 8000,
          severity: "Medium",
        },
      ])
      setRescueTeams([
        {
          team_id: 1,
          team_name: "Dhaka Fire Service Alpha",
          team_type: "Search and Rescue",
          availability: "busy",
        },
        {
          team_id: 2,
          team_name: "Sylhet Volunteer Group One",
          team_type: "Logistics & Relief",
          availability: "available",
        },
        {
          team_id: 3,
          team_name: "Red Crescent Medical Team B",
          team_type: "Medical Support",
          availability: "available",
        },
        {
          team_id: 4,
          team_name: "Coast Guard Rescue Unit 5",
          team_type: "Water Rescue",
          availability: "busy",
        },
      ])
      setAssignments([
        {
          assignment_id: 1,
          team_id: 1,
          request_id: 1,
          status: "on_route",
          assignment_at: "2026-08-30 14:45",
        },
        {
          assignment_id: 2,
          team_id: 3,
          request_id: 2,
          status: "assigned",
          assignment_at: "2026-08-30 16:30",
        },
        {
          assignment_id: 3,
          team_id: 4,
          request_id: 3,
          status: "completed",
          assignment_at: "2026-08-30 17:15",
        },
      ])
    }
  }, [api])

  React.useEffect(() => {
    fetchBackendData()
  }, [fetchBackendData])

  // --- ACTIONS & HANDLERS ---
  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!areaForm.location_id || !areaForm.affected_population) {
      toast.error("Please fill out all fields.")
      return
    }

    const payload = {
      disaster_id: Number(areaForm.disaster_id),
      location_id: Number(areaForm.location_id),
      affected_population: Number(areaForm.affected_population),
      severity: areaForm.severity,
    }

    if (!isOffline) {
      try {
        const res = await api.admin.affectedAreas.create(payload)
        setAffectedAreas([res.data, ...affectedAreas])
        toast.success(
          `Area successfully saved to backend (ID: ${res.data.area_id})`
        )
      } catch (err) {
        toast.error("Failed to save to backend. Attempting local save instead.")
      }
    } else {
      const newArea: AffectedArea = {
        area_id:
          affectedAreas.length > 0
            ? Math.max(...affectedAreas.map((a) => a.area_id)) + 1
            : 1,
        ...payload,
      }
      setAffectedAreas([newArea, ...affectedAreas])
      toast.success(`Local offline record saved (ID: ${newArea.area_id})`)
    }

    setAreaForm({
      disaster_id: 1,
      location_id: "",
      affected_population: "",
      severity: "Medium",
    })
  }

  const handleDeleteArea = async (id: number) => {
    if (!isOffline) {
      try {
        await api.admin.affectedAreas.remove(id)
        setAffectedAreas(affectedAreas.filter((a) => a.area_id !== id))
        toast.success("Area deleted from backend database.")
      } catch (err) {
        toast.error("Failed to delete from backend.")
      }
    } else {
      setAffectedAreas(affectedAreas.filter((a) => a.area_id !== id))
      toast.info("Local area record removed.")
    }
  }

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamForm.team_name) {
      toast.error("Please enter team name.")
      return
    }

    const payload = {
      team_name: teamForm.team_name,
      team_type: teamForm.team_type,
      availability: teamForm.availability,
    }

    if (!isOffline) {
      try {
        const res = await api.admin.rescueTeams.create(payload)
        setRescueTeams([res.data, ...rescueTeams])
        toast.success(
          `Rescue team successfully saved to backend (ID: ${res.data.team_id})`
        )
      } catch (err) {
        toast.error("Failed to save to backend.")
      }
    } else {
      const newTeam: RescueTeam = {
        team_id:
          rescueTeams.length > 0
            ? Math.max(...rescueTeams.map((t) => t.team_id)) + 1
            : 1,
        ...payload,
      }
      setRescueTeams([newTeam, ...rescueTeams])
      toast.success(`Local offline team saved: ${newTeam.team_name}`)
    }

    setTeamForm({
      team_name: "",
      team_type: "Search and Rescue",
      availability: "available",
    })
  }

  const handleDeleteTeam = async (id: number) => {
    if (!isOffline) {
      try {
        await api.admin.rescueTeams.remove(id)
        setRescueTeams(rescueTeams.filter((t) => t.team_id !== id))
        toast.success("Team deleted from backend.")
      } catch (err) {
        toast.error("Failed to delete team.")
      }
    } else {
      setRescueTeams(rescueTeams.filter((t) => t.team_id !== id))
      toast.info("Local team removed.")
    }
  }

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      team_id: Number(assignmentForm.team_id),
      request_id: Number(assignmentForm.request_id),
      status: assignmentForm.status,
    }

    if (!isOffline) {
      try {
        const res = await api.admin.assignments.create(payload)
        const mapped = {
          ...res.data,
          assignment_at: res.data.assignment_at
            ? res.data.assignment_at.slice(0, 16).replace("T", " ")
            : "",
        }
        setAssignments([mapped, ...assignments])
        toast.success("Assignment dispatched and saved to database!")
      } catch (err) {
        toast.error("Failed to dispatch on backend.")
      }
    } else {
      const newAssignment: TeamAssignment = {
        assignment_id:
          assignments.length > 0
            ? Math.max(...assignments.map((as) => as.assignment_id)) + 1
            : 1,
        ...payload,
        assignment_at: new Date().toISOString().slice(0, 16).replace("T", " "),
      }
      setAssignments([newAssignment, ...assignments])
      toast.success("Local offline assignment dispatched.")
    }
  }

  const toggleAssignmentStatus = async (id: number) => {
    const statuses: TeamAssignment["status"][] = [
      "assigned",
      "on_route",
      "completed",
      "cancelled",
    ]
    const current = assignments.find((as) => as.assignment_id === id)
    if (!current) return

    const nextIndex = (statuses.indexOf(current.status) + 1) % statuses.length
    const nextStatus = statuses[nextIndex]!

    if (!isOffline) {
      try {
        const res = await api.admin.assignments.updateStatus(id, nextStatus)
        setAssignments(
          assignments.map((as) =>
            as.assignment_id === id
              ? {
                  ...res.data,
                  assignment_at: res.data.assignment_at
                    ? res.data.assignment_at.slice(0, 16).replace("T", " ")
                    : "",
                }
              : as
          )
        )
        toast.success(`Backend assignment status updated to: ${nextStatus}`)
      } catch (err) {
        toast.error("Failed to update status on backend.")
      }
    } else {
      setAssignments(
        assignments.map((as) =>
          as.assignment_id === id ? { ...as, status: nextStatus } : as
        )
      )
      toast.success(`Local assignment status updated: ${nextStatus}`)
    }
  }

  const handleDeleteAssignment = async (id: number) => {
    if (!isOffline) {
      try {
        await api.admin.assignments.remove(id)
        setAssignments(assignments.filter((as) => as.assignment_id !== id))
        toast.success("Assignment deleted from backend database.")
      } catch (err) {
        toast.error("Failed to delete assignment.")
      }
    } else {
      setAssignments(assignments.filter((as) => as.assignment_id !== id))
      toast.info("Local assignment record removed.")
    }
  }

  // --- STATS COMPUTATIONS ---
  const totalPopulation = affectedAreas.reduce(
    (acc, curr) => acc + curr.affected_population,
    0
  )
  const activeTeams = rescueTeams.filter(
    (t) => t.availability !== "offline"
  ).length
  const activeAssignments = assignments.filter(
    (as) => as.status === "assigned" || as.status === "on_route"
  ).length

  return (
    <div className="space-y-6">
      {/* Offline Status Warning banner */}
      {isOffline && (
        <div className="animate-fade-in flex items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-500">
          <div className="flex items-center gap-2">
            <WifiOff className="size-4 shrink-0" />
            <span>
              <strong>Local Mode:</strong> Unable to connect to Laravel API.
              Operating on local memory database fallback.
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchBackendData}
            className="h-7 border-amber-500/30 py-1 text-xs hover:bg-amber-500/10"
          >
            Retry Connection
          </Button>
        </div>
      )}

      {/* Dynamic Metrics Header */}
      <MetricStrip columns={3}>
        <MetricStripItem
          value={totalPopulation.toLocaleString()}
          label="Affected Population"
          detail="Total population across all declared sectors"
          icon={<Users className="animate-pulse text-destructive" />}
        />
        <MetricStripItem
          value={`${activeTeams}/${rescueTeams.length}`}
          label="Active Rescue Teams"
          detail="Operational groups online/ready"
          icon={<Truck className="text-primary" />}
        />
        <MetricStripItem
          value={activeAssignments.toString()}
          label="Pending Assignments"
          detail="Ongoing field response missions"
          icon={<Activity className="text-emerald-500" />}
        />
      </MetricStrip>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("areas")}
          className={`-mb-px flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === "areas"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <MapPin className="size-4" /> Affected Areas
        </button>
        <button
          onClick={() => setActiveTab("teams")}
          className={`-mb-px flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === "teams"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Truck className="size-4" /> Rescue Teams
        </button>
        <button
          onClick={() => setActiveTab("assignments")}
          className={`-mb-px flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === "assignments"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="size-4" /> Team Assignments
        </button>
      </div>

      {/* Tabs Contents */}
      <div className="transition-all duration-300">
        {activeTab === "areas" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Form Section */}
            <div className="lg:col-span-4">
              <Card className="border-primary/10 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                    <Plus className="size-5 text-primary" /> Declare Affected
                    Area
                  </CardTitle>
                  <CardDescription>
                    Register a new disaster impact sector
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleAddArea} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="disaster_id">Disaster Campaign</Label>
                      <select
                        id="disaster_id"
                        value={areaForm.disaster_id}
                        onChange={(e) =>
                          setAreaForm({
                            ...areaForm,
                            disaster_id: Number(e.target.value),
                          })
                        }
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      >
                        {disastersList.map((d) => (
                          <option key={d.disaster_id} value={d.disaster_id}>
                            {d.disaster_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location_id">Location ID (Geocode)</Label>
                      <Input
                        id="location_id"
                        type="number"
                        placeholder="e.g. 101"
                        value={areaForm.location_id}
                        onChange={(e) =>
                          setAreaForm({
                            ...areaForm,
                            location_id: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="affected_population">
                        Affected Population
                      </Label>
                      <Input
                        id="affected_population"
                        type="number"
                        placeholder="Estimated population count"
                        value={areaForm.affected_population}
                        onChange={(e) =>
                          setAreaForm({
                            ...areaForm,
                            affected_population: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area_severity">Severity Tier</Label>
                      <select
                        id="area_severity"
                        value={areaForm.severity}
                        onChange={(e) =>
                          setAreaForm({
                            ...areaForm,
                            severity: e.target
                              .value as AffectedArea["severity"],
                          })
                        }
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <Button type="submit" className="mt-2 w-full">
                      <Plus className="size-4" /> Save Area Record
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* List/Table Section */}
            <div className="space-y-4 lg:col-span-8">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Layers className="size-5 text-muted-foreground" /> Declared
                    Impact Zones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-border/80 font-semibold text-muted-foreground">
                          <th className="px-4 py-3">Area ID</th>
                          <th className="px-4 py-3">Disaster</th>
                          <th className="px-4 py-3">Location Code</th>
                          <th className="px-4 py-3 text-right">Population</th>
                          <th className="px-4 py-3 text-center">Severity</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {affectedAreas.map((area) => {
                          const disaster = disastersList.find(
                            (d) => d.disaster_id === area.disaster_id
                          )
                          return (
                            <tr
                              key={area.area_id}
                              className="group transition-colors hover:bg-primary/5"
                            >
                              <td className="px-4 py-3 font-mono text-muted-foreground">
                                #{area.area_id}
                              </td>
                              <td className="px-4 py-3 font-medium text-foreground">
                                {disaster
                                  ? disaster.disaster_name
                                  : `Disaster #${area.disaster_id}`}
                              </td>
                              <td className="px-4 py-3 font-mono text-muted-foreground">
                                {area.location_id}
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                {area.affected_population.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge
                                  variant={
                                    area.severity === "Critical"
                                      ? "destructive"
                                      : area.severity === "High"
                                        ? "secondary"
                                        : area.severity === "Medium"
                                          ? "default"
                                          : "outline"
                                  }
                                >
                                  {area.severity}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleDeleteArea(area.area_id)}
                                  className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                        {affectedAreas.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-6 text-center text-muted-foreground"
                            >
                              No declared affected areas found. Add one above!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "teams" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Form Section */}
            <div className="lg:col-span-4">
              <Card className="border-primary/10 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                    <Plus className="size-5 text-primary" /> Register Rescue
                    Team
                  </CardTitle>
                  <CardDescription>
                    Add operational unit details to database
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleAddTeam} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="team_name">Rescue Team Name</Label>
                      <Input
                        id="team_name"
                        type="text"
                        placeholder="e.g. Dhaka Fire Service Alpha"
                        value={teamForm.team_name}
                        onChange={(e) =>
                          setTeamForm({
                            ...teamForm,
                            team_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team_type">Unit Specialization</Label>
                      <select
                        id="team_type"
                        value={teamForm.team_type}
                        onChange={(e) =>
                          setTeamForm({
                            ...teamForm,
                            team_type: e.target.value,
                          })
                        }
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      >
                        <option value="Search and Rescue">
                          Search and Rescue
                        </option>
                        <option value="Logistics & Relief">
                          Logistics & Relief
                        </option>
                        <option value="Medical Support">Medical Support</option>
                        <option value="Water Rescue">Water Rescue</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability Status</Label>
                      <select
                        id="availability"
                        value={teamForm.availability}
                        onChange={(e) =>
                          setTeamForm({
                            ...teamForm,
                            availability: e.target
                              .value as RescueTeam["availability"],
                          })
                        }
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      >
                        <option value="available">Available (Standby)</option>
                        <option value="busy">
                          Busy (On Active Assignment)
                        </option>
                        <option value="offline">
                          Offline (Out of Service)
                        </option>
                      </select>
                    </div>

                    <Button type="submit" className="mt-2 w-full">
                      <Plus className="size-4" /> Save Team Unit
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* List/Table Section */}
            <div className="space-y-4 lg:col-span-8">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="size-5 text-muted-foreground" />{" "}
                    Registered Units
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-border/80 font-semibold text-muted-foreground">
                          <th className="px-4 py-3">Team ID</th>
                          <th className="px-4 py-3">Team Name</th>
                          <th className="px-4 py-3">Specialization</th>
                          <th className="px-4 py-3 text-center">
                            Availability Status
                          </th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {rescueTeams.map((team) => (
                          <tr
                            key={team.team_id}
                            className="group transition-colors hover:bg-primary/5"
                          >
                            <td className="px-4 py-3 font-mono text-muted-foreground">
                              #{team.team_id}
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">
                              {team.team_name}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {team.team_type}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge
                                variant={
                                  team.availability === "available"
                                    ? "secondary"
                                    : team.availability === "busy"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {team.availability === "available"
                                  ? "🟢 Available"
                                  : team.availability === "busy"
                                    ? "🔴 Busy"
                                    : "⚪ Offline"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteTeam(team.team_id)}
                                className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {rescueTeams.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-6 text-center text-muted-foreground"
                            >
                              No rescue teams registered. Add one above!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Form Section */}
            <div className="lg:col-span-4">
              <Card className="border-primary/10 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                    <Plus className="size-5 text-primary" /> Create Mission
                    Assignment
                  </CardTitle>
                  <CardDescription>
                    Assign rescue team to emergency request
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleAddAssignment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assign_team">Assign Rescue Team</Label>
                      <select
                        id="assign_team"
                        value={assignmentForm.team_id}
                        onChange={(e) =>
                          setAssignmentForm({
                            ...assignmentForm,
                            team_id: Number(e.target.value),
                          })
                        }
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      >
                        {rescueTeams.map((t) => (
                          <option key={t.team_id} value={t.team_id}>
                            {t.team_name} ({t.availability})
                          </option>
                        ))}
                        {rescueTeams.length === 0 && (
                          <option value="">No teams available</option>
                        )}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assign_request">
                        Target Incident Request ID
                      </Label>
                      <select
                        id="assign_request"
                        value={assignmentForm.request_id}
                        onChange={(e) =>
                          setAssignmentForm({
                            ...assignmentForm,
                            request_id: Number(e.target.value),
                          })
                        }
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      >
                        {emergencyRequests.map((r) => (
                          <option key={r.request_id} value={r.request_id}>
                            Request #{r.request_id} (Priority: {r.priority})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assignment_status">
                        Deployment Status
                      </Label>
                      <select
                        id="assignment_status"
                        value={assignmentForm.status}
                        onChange={(e) =>
                          setAssignmentForm({
                            ...assignmentForm,
                            status: e.target.value as TeamAssignment["status"],
                          })
                        }
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      >
                        <option value="assigned">Assigned</option>
                        <option value="on_route">On Route</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <Button
                      type="submit"
                      className="mt-2 w-full"
                      disabled={rescueTeams.length === 0}
                    >
                      <Plus className="size-4" /> Dispatch Unit
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* List/Table Section */}
            <div className="space-y-4 lg:col-span-8">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ClipboardList className="size-5 text-muted-foreground" />{" "}
                    Dispatch Board
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-border/80 font-semibold text-muted-foreground">
                          <th className="px-4 py-3">Assignment ID</th>
                          <th className="px-4 py-3">Rescue Unit Assigned</th>
                          <th className="px-4 py-3">Incident Request ID</th>
                          <th className="px-4 py-3 text-center">
                            Dispatch Time
                          </th>
                          <th className="px-4 py-3 text-center">
                            Mission Status
                          </th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {assignments.map((as) => {
                          const team = rescueTeams.find(
                            (t) => t.team_id === as.team_id
                          )
                          return (
                            <tr
                              key={as.assignment_id}
                              className="group transition-colors hover:bg-primary/5"
                            >
                              <td className="px-4 py-3 font-mono text-muted-foreground">
                                #{as.assignment_id}
                              </td>
                              <td className="px-4 py-3 font-medium text-foreground">
                                {team ? team.team_name : `Team #${as.team_id}`}
                              </td>
                              <td className="px-4 py-3 font-mono text-muted-foreground">
                                Request #{as.request_id}
                              </td>
                              <td className="px-4 py-3 text-center text-muted-foreground">
                                {as.assignment_at}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() =>
                                    toggleAssignmentStatus(as.assignment_id)
                                  }
                                  className="inline-block transition-all hover:scale-105 focus:outline-none active:scale-95"
                                  title="Click to cycle status"
                                >
                                  <Badge
                                    variant={
                                      as.status === "completed"
                                        ? "secondary"
                                        : as.status === "on_route"
                                          ? "default"
                                          : as.status === "assigned"
                                            ? "outline"
                                            : "destructive"
                                    }
                                  >
                                    {as.status === "assigned" && "📋 Assigned"}
                                    {as.status === "on_route" && "⚡ On Route"}
                                    {as.status === "completed" &&
                                      "✅ Completed"}
                                    {as.status === "cancelled" &&
                                      "❌ Cancelled"}
                                  </Badge>
                                </button>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() =>
                                    handleDeleteAssignment(as.assignment_id)
                                  }
                                  className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                        {assignments.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-6 text-center text-muted-foreground"
                            >
                              No active assignments. Create one to dispatch a
                              team!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
                    <HelpCircle className="size-3.5" />
                    <span>
                      💡 Tip: Click on a mission status badge to cycle and
                      change the dispatch status.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
