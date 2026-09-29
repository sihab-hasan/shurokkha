"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import { Container } from "@shurokkha/ui/layout/container"
import { Section } from "@shurokkha/ui/layout/section"

import { adminRoutes } from "@/config/routes"
import { FacilityLocationsTable } from "@/components/operations/facility-locations-table"
import { JoinTable } from "@/components/operations/join-table"
import {
  useFacilityLocations,
  useFullOuterJoin,
  useInnerJoin,
  useLeftJoin,
  useRightJoin,
} from "@/hooks/operations/use-reports"

export default function ReportsJoinsPage() {
  const inner = useInnerJoin()
  const left = useLeftJoin()
  const right = useRightJoin()
  const full = useFullOuterJoin()
  const facilities = useFacilityLocations()

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

        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            Join Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            Cross-table joins produced by raw SQL on the operations schema. Each
            flavor surfaces a different subset of the join space.
          </p>
        </header>

        <JoinTable
          title="Inner Join"
          description="Users whose request has a matching disaster."
          data={inner.data as unknown as Array<Record<string, unknown>>}
          isLoading={inner.isLoading}
          emptyMessage="No matching rows."
        />

        <JoinTable
          title="Left Join"
          description="All users, with disaster details where available."
          data={left.data as unknown as Array<Record<string, unknown>>}
          isLoading={left.isLoading}
          emptyMessage="No rows from left join."
        />

        <JoinTable
          title="Right Join"
          description="Disasters with associated user requests (where present)."
          data={right.data as unknown as Array<Record<string, unknown>>}
          isLoading={right.isLoading}
          emptyMessage="No rows from right join."
        />

        <JoinTable
          title="Full Outer Join"
          description="Union of left and right joins without duplicate rows."
          data={full.data as unknown as Array<Record<string, unknown>>}
          isLoading={full.isLoading}
          emptyMessage="No rows from full outer join."
        />

        <FacilityLocationsTable />
      </Container>
    </Section>
  )
}
