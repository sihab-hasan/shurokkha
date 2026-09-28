"use client"

import { useState } from "react"
import { MapPin, Plus, Trash2, Users, AlertTriangle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Button } from "@shurokkha/ui/components/button"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { Badge } from "@shurokkha/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shurokkha/ui/components/table"
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { useOperationsData } from "../hooks/use-operations"

export function AffectedAreasTab() {
  const { affectedAreas, disasters } = useOperationsData()

  const [disasterId, setDisasterId] = useState<string>("")
  const [locationId, setLocationId] = useState<string>("101")
  const [population, setPopulation] = useState<string>("")
  const [severity, setSeverity] = useState<string>("Critical")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedDisaster = parseInt(
      disasterId || String(disasters[0]?.disaster_id || 1),
      10
    )
    const parsedPopulation = parseInt(population, 10)
    const parsedLocation = locationId ? parseInt(locationId, 10) : undefined

    if (!parsedPopulation || parsedPopulation <= 0) return

    affectedAreas.create.mutate(
      {
        disaster_id: parsedDisaster,
        location_id: parsedLocation,
        affected_population: parsedPopulation,
        severity,
      },
      {
        onSuccess: () => {
          setPopulation("")
        },
      }
    )
  }

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev?.toLowerCase()) {
      case "critical":
        return "bg-destructive/15 text-destructive border-destructive/30"
      case "high":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
      case "medium":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Input Form */}
      <div className="lg:col-span-4">
        <Card className="sticky top-24 border-primary/20 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <MapPin className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Add Affected Area</CardTitle>
                <CardDescription>
                  Insert record into{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    affected_areas
                  </code>{" "}
                  table
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disaster_id">Linked Disaster *</Label>
                <NativeSelect
                  id="disaster_id"
                  value={disasterId || String(disasters[0]?.disaster_id || "")}
                  onChange={(e) => setDisasterId(e.target.value)}
                  className="w-full"
                  required
                >
                  {disasters.map((d) => (
                    <option key={d.disaster_id} value={d.disaster_id}>
                      #{d.disaster_id} - {d.disaster_name} ({d.severity})
                    </option>
                  ))}
                  {disasters.length === 0 && (
                    <option value="1">#1 - Sylhet Flash Flood</option>
                  )}
                </NativeSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_id">Location ID (Zone/Geo Code)</Label>
                <Input
                  id="location_id"
                  type="number"
                  placeholder="e.g. 101, 102, 201"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="population">
                  Affected Population (People) *
                </Label>
                <div className="relative">
                  <Users className="absolute top-3 left-3 size-4 text-muted-foreground" />
                  <Input
                    id="population"
                    type="number"
                    min="1"
                    placeholder="e.g. 25000"
                    value={population}
                    onChange={(e) => setPopulation(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Impact Severity *</Label>
                <NativeSelect
                  id="severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </NativeSelect>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={affectedAreas.create.isPending}
              >
                <Plus className="size-4" />
                {affectedAreas.create.isPending
                  ? "Inserting..."
                  : "Insert Affected Area"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Live Table */}
      <div className="space-y-4 lg:col-span-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span>Affected Areas Live Table</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {affectedAreas.data.length} records
                </Badge>
              </CardTitle>
              <CardDescription>
                Live data directly synced from MySQL database
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-16">Area ID</TableHead>
                    <TableHead>Disaster</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affectedAreas.isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Loading affected areas...
                      </TableCell>
                    </TableRow>
                  ) : affectedAreas.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No affected areas found in database. Add one on the
                        left!
                      </TableCell>
                    </TableRow>
                  ) : (
                    affectedAreas.data.map((row) => (
                      <TableRow key={row.area_id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-xs font-medium">
                          #{row.area_id}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {row.disaster_name ||
                              `Disaster #${row.disaster_id}`}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ID: {row.disaster_id}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {row.location_id ? `Loc #${row.location_id}` : "N/A"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {Number(row.affected_population).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getSeverityBadgeClass(row.severity)}
                          >
                            {row.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              affectedAreas.remove.mutate(row.area_id)
                            }
                            disabled={affectedAreas.remove.isPending}
                            title="Delete Row"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
