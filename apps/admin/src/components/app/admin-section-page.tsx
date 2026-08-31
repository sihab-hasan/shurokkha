import Link from "next/link"
import {
  ArrowLeft,
  BellRing,
  Boxes,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  LifeBuoy,
  MapPinned,
  Settings,
  ShieldCheck,
  Siren,
  UsersRound,
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
import {
  CollectionGrid,
  CollectionView,
} from "@shurokkha/ui-patterns/collections"
import { MetricStrip, MetricStripItem } from "@shurokkha/ui-patterns/dashboard"
import { StatusBanner } from "@shurokkha/ui-patterns/feedback"
import { ContentSection } from "@shurokkha/ui-patterns/layout"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
import { OperationsWorkspace } from "@/components/app/operations-workspace"

const sections = {
  incidents: {
    title: "Incidents",
    description: "Validate, coordinate and track active incident response.",
    icon: Siren,
  },
  operations: {
    title: "Operations map",
    description:
      "Coordinate geography, field teams, shelters and active response layers.",
    icon: MapPinned,
  },
  shelters: {
    title: "Shelter network",
    description:
      "Monitor capacity, readiness, verification and local availability.",
    icon: LifeBuoy,
  },
  people: {
    title: "People & access",
    description: "Manage operational identities, roles and access reviews.",
    icon: UsersRound,
  },
  volunteers: {
    title: "Volunteer operations",
    description:
      "Coordinate readiness, assignments, teams and deployment status.",
    icon: HeartHandshake,
  },
  resources: {
    title: "Resources",
    description:
      "Track high-priority supplies, logistics and resource requests.",
    icon: Boxes,
  },
  approvals: {
    title: "Approvals",
    description:
      "Review sensitive operational changes through a controlled workflow.",
    icon: ClipboardCheck,
  },
  reports: {
    title: "Reports",
    description:
      "Review operational performance, audit history and export-ready reporting.",
    icon: ChartNoAxesCombined,
  },
  notifications: {
    title: "Notifications",
    description: "Review system, workflow and operational notifications.",
    icon: BellRing,
  },
  settings: {
    title: "Settings",
    description:
      "Configure admin preferences and platform-level operating controls.",
    icon: Settings,
  },
} as const

type SectionKey = keyof typeof sections

function humanize(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

export interface AdminSectionPageProps {
  section: string[]
}

export function AdminSectionPage({ section }: AdminSectionPageProps) {
  const key = (section[0] ?? "incidents") as SectionKey
  const config = sections[key] ?? {
    title: humanize(section[0] ?? "Workspace"),
    description:
      "Shared operational workspace powered by the Shurokkha design system.",
    icon: ShieldCheck,
  }
  const subpage =
    section.length > 1 ? humanize(section.slice(1).join(" / ")) : null
  const Icon = config.icon

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title={subpage ? `${config.title} / ${subpage}` : config.title}
        description={config.description}
        metadata={
          <>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> Pattern-backed screen
            </span>
            <span>Role-aware • audit-ready</span>
          </>
        }
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/" />}
            >
              <ArrowLeft /> Command center
            </Button>
            <Button>
              <Icon /> Primary action
            </Button>
          </div>
        }
      />

      {key === "operations" ? (
        <OperationsWorkspace />
      ) : (
        <>
          <StatusBanner
            tone="neutral"
            icon={<Icon />}
            title={`${config.title} workspace is ready for domain integration.`}
            description="The screen shell, states and responsive structure are shared. Replace the sample content with live API data without moving domain models into ui-patterns."
            metadata="Future-proof route scaffold"
          />

          <MetricStrip columns={3}>
            <MetricStripItem
              value="24"
              label="Open items"
              detail="Current operational queue"
              icon={<Icon />}
            />
            <MetricStripItem
              value="91%"
              label="Within SLA"
              detail="Across active work"
              icon={<CheckCircle2 />}
            />
            <MetricStripItem
              value="6"
              label="Need attention"
              detail="Prioritized for review"
              icon={<ClipboardCheck />}
            />
          </MetricStrip>

          <ContentSection
            title={`${config.title} overview`}
            description="This collection surface can switch to real cards, rows or a data table when the feature data contract is finalized."
          >
            <CollectionView surface="card">
              <CollectionGrid columns={3} className="p-4 sm:p-5">
                {["Priority queue", "Recent activity", "Operational health"].map(
                  (title, index) => (
                    <Card key={title} className="shadow-none">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon />
                          </span>
                          <Badge
                            variant={
                              index === 0
                                ? "destructive"
                                : index === 1
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {index === 0 ? "Review" : "Ready"}
                          </Badge>
                        </div>
                        <CardTitle className="text-base">{title}</CardTitle>
                        <CardDescription>
                          Reusable presentation shell with app-owned business
                          content.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Connect this block to the relevant service when the module
                        is implemented.
                      </CardContent>
                    </Card>
                  )
                )}
              </CollectionGrid>
            </CollectionView>
          </ContentSection>
        </>
      )}
    </div>
  )
}
