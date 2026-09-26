import * as React from "react"
import Link from "next/link"
import {
  FileHeart,
  HandHeart,
  HeartHandshake,
  ShieldAlert,
  UserSearch,
} from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { routes } from "@/config/routes"
import { StatCard } from "../components/stat-card"

export function DashboardStatsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Assistance Requests"
        icon={HeartHandshake}
        value="2 Active"
        description="Emergency food kit & medical aid"
        actions={
          <>
            <Button
              size="sm"
              render={<Link href={routes.account.createAssistance} />}
            >
              Request Aid
            </Button>
            <Button
              size="sm"
              variant="outline"
              render={<Link href={routes.account.assistance} />}
            >
              View All
            </Button>
          </>
        }
      />

      <StatCard
        title="Donations"
        icon={HandHeart}
        value="৳15,000"
        description="Contributed across 3 campaigns"
        actions={
          <Button
            size="sm"
            variant="outline"
            render={<Link href={routes.account.donations} />}
          >
            History
          </Button>
        }
      />

      <StatCard
        title="Volunteer Missions"
        icon={FileHeart}
        value="1 Upcoming"
        description="Flood Relief Distribution Crew"
        actions={
          <Button
            size="sm"
            render={<Link href={routes.account.volunteering} />}
          >
            Missions Hub
          </Button>
        }
      />

      <StatCard
        title="Missing Persons"
        icon={UserSearch}
        value="0 Active"
        description="Search and sighting reports"
        actions={
          <Button
            size="sm"
            variant="outline"
            render={<Link href={routes.account.missingPersons} />}
          >
            Reports
          </Button>
        }
      />

      <StatCard
        title="Grievances & Complaints"
        icon={ShieldAlert}
        value="0 Pending"
        description="Relief distribution feedback"
        actions={
          <Button
            size="sm"
            variant="outline"
            render={<Link href={routes.account.complaints} />}
          >
            View Complaints
          </Button>
        }
      />
    </div>
  )
}
