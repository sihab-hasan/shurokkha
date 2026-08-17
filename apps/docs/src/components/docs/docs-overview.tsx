import Link from "next/link"
import {
  AppWindow,
  ArrowRight,
  Blocks,
  BookOpenCheck,
  Boxes,
  Braces,
  CheckCircle2,
  Component,
  FileCode2,
  Layers3,
  Route,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react"

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
import { StatusBanner } from "@shurokkha/ui-patterns/feedback"
import { ContentSection } from "@shurokkha/ui-patterns/layout"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
import { ProcessSteps } from "@shurokkha/ui-patterns/progress"

const patternGroups = [
  {
    title: "Layout & shells",
    description:
      "WorkspaceShell, ContentContainer, SidebarLayout, SplitView and ExplorerLayout.",
    icon: Layers3,
    href: "/patterns/layout",
  },
  {
    title: "Collections",
    description:
      "Reusable list/grid surfaces with loading, empty, error and pagination states.",
    icon: Boxes,
    href: "/patterns/collections",
  },
  {
    title: "Entity & workflow",
    description:
      "Detail headers, metadata, statuses, approvals and operational timelines.",
    icon: Workflow,
    href: "/patterns/workflow",
  },
  {
    title: "Forms & filters",
    description:
      "Structured form sections, actions, validation, filter bars and saved views.",
    icon: Component,
    href: "/patterns/forms",
  },
  {
    title: "Dashboard & reporting",
    description:
      "KPIs, metrics, widgets, report viewers, export and reporting filters.",
    icon: AppWindow,
    href: "/patterns/dashboard",
  },
  {
    title: "Feedback & messaging",
    description:
      "Status banners, data freshness, states, conversations and notifications.",
    icon: Sparkles,
    href: "/patterns/feedback",
  },
]

export function DocsOverview() {
  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <PageHeader
          eyebrow="Shurokkha design system"
          title="Build consistent disaster-response experiences without rebuilding the same UI."
          description="The documentation app describes how shared UI primitives, reusable interaction patterns, and application-specific business modules fit together across Web, Admin and future operational products."
          metadata={
            <>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" /> Shared packages ready
              </span>
              <span>React 19 • Next.js 16 • Tailwind CSS</span>
            </>
          }
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/design-system" />}
              >
                Design system
              </Button>
              <Button nativeButton={false} render={<Link href="/patterns" />}>
                Explore patterns <ArrowRight />
              </Button>
            </div>
          }
        />

        <StatusBanner
          tone="info"
          icon={<ShieldCheck />}
          title="Reusable does not mean domain-specific."
          description="Keep DisasterCard, ShelterCard and business rules inside applications. Move only stable layout, state and interaction structures into ui-patterns."
          metadata="Architecture guardrail"
        />
      </section>

      <ContentSection
        title="Package architecture"
        description="Dependencies flow downward so every application can share behavior without creating circular coupling."
        divided
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: AppWindow,
              title: "Applications",
              code: "apps/web • apps/admin • apps/docs",
              description:
                "Routes, domain data, business logic and app-specific compositions.",
            },
            {
              icon: Blocks,
              title: "UI patterns",
              code: "@shurokkha/ui-patterns",
              description:
                "Reusable shells, collections, workflows, feedback, forms and reporting structures.",
            },
            {
              icon: Component,
              title: "UI primitives",
              code: "@shurokkha/ui",
              description:
                "Buttons, inputs, cards, dialogs, tables, sidebar primitives and design tokens.",
            },
          ].map((item) => (
            <Card key={item.title} className="min-w-0">
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon />
                </span>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="rounded-md bg-muted px-2 py-1 text-xs">
                  {item.code}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        title="Pattern catalog"
        description="Patterns cover recurring product structures while remaining independent of Shurokkha-specific entities."
        divided
      >
        <CollectionView>
          <CollectionGrid columns={3}>
            {patternGroups.map((group) => (
              <Card
                key={group.title}
                className="group transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                    <group.icon />
                  </span>
                  <CardTitle className="text-base">{group.title}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    variant="ghost"
                    nativeButton={false}
                    render={<Link href={group.href} />}
                  >
                    Open reference <ArrowRight />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CollectionGrid>
        </CollectionView>
      </ContentSection>

      <ContentSection
        title="How an app should consume the system"
        description="Start with the highest-level reusable structure that matches the screen, then drop down to primitives only where needed."
        divided
      >
        <Card>
          <CardContent className="py-6">
            <ProcessSteps
              orientation="horizontal"
              steps={[
                {
                  id: "shell",
                  title: "Choose a shell",
                  description:
                    "WorkspaceShell, SidebarLayout, AuthShell or ExplorerLayout.",
                  status: "complete",
                  indicator: <Route className="size-3.5" />,
                },
                {
                  id: "pattern",
                  title: "Compose patterns",
                  description:
                    "Collections, dashboard, entity, workflow and feedback.",
                  status: "current",
                  indicator: <Blocks className="size-3.5" />,
                },
                {
                  id: "primitive",
                  title: "Use primitives",
                  description:
                    "Buttons, inputs and cards for local composition.",
                  indicator: <Component className="size-3.5" />,
                },
                {
                  id: "domain",
                  title: "Add domain UI",
                  description:
                    "Keep business-specific content in the application.",
                  indicator: <Braces className="size-3.5" />,
                },
              ]}
            />
          </CardContent>
        </Card>
      </ContentSection>

      <ContentSection
        title="Future-proofing rules"
        description="The system should scale by capability, not by accumulating one-off components."
        divided
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              icon: FileCode2,
              title: "Stable APIs",
              description:
                "Pattern props describe UI intent instead of backend entities, so API and data-model changes do not force package rewrites.",
            },
            {
              icon: BookOpenCheck,
              title: "Document real reuse",
              description:
                "Extract a new pattern only after recurring structure is clear across screens or applications.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex-row gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon />
                </span>
                <div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {item.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ContentSection>
    </div>
  )
}
