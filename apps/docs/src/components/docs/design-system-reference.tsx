import {
  Blocks,
  CheckCircle2,
  Component,
  Layers3,
  ShieldCheck,
  Sparkles,
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
import { EntityStatus } from "@shurokkha/ui-patterns/entity"
import { StatusBanner } from "@shurokkha/ui-patterns/feedback"
import { ContentSection } from "@shurokkha/ui-patterns/layout"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"

const foundation = [
  {
    label: "Base radius",
    value: "10px",
    detail: "8px controls · 10px menus · 12px cards",
  },
  {
    label: "Default control",
    value: "40px",
    detail: "32 / 36 / 40 / 44px sizing ladder",
  },
  {
    label: "Content gutter",
    value: "16–32px",
    detail: "16 mobile · 24 small · 32 desktop",
  },
  {
    label: "Public section",
    value: "48–80px",
    detail: "More spacious than operational workspaces",
  },
] as const

const semanticStates = [
  {
    name: "Info",
    className: "bg-info",
    token: "--info",
    description: "System context and neutral informational emphasis",
  },
  {
    name: "Success",
    className: "bg-success",
    token: "--success",
    description: "Verified, completed, healthy, or available",
  },
  {
    name: "Warning",
    className: "bg-warning",
    token: "--warning",
    description: "Attention required, degraded, stale, or caution",
  },
  {
    name: "Danger",
    className: "bg-danger",
    token: "--danger",
    description: "Critical risk, destructive action, or failure",
  },
] as const

const pageArchetypes = [
  {
    icon: Layers3,
    title: "Public",
    description:
      "Editorial spacing, default content grid, clear calls to action, and no decorative horizontal section dividers.",
  },
  {
    icon: Blocks,
    title: "Workspace",
    description:
      "Denser page rhythm composed from dashboard, collection, entity, form, reporting, and messaging patterns.",
  },
  {
    icon: ShieldCheck,
    title: "Admin",
    description:
      "The same primitives and tokens with operational density, explicit status, and data-heavy composition.",
  },
  {
    icon: Component,
    title: "Docs",
    description:
      "Neutral reference surfaces that demonstrate the same components without creating a second visual language.",
  },
] as const

export function DesignSystemReference() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Shurokkha design system"
        title="A calm, consistent interface language for high-context and high-pressure work."
        description="The existing Shurokkha light and dark theme remains the source of truth. The design system standardizes semantics, geometry, spacing, interaction states, reusable patterns, and page composition around that theme."
        metadata={
          <>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> Theme values preserved
            </span>
            <span>UI → UI patterns → applications</span>
          </>
        }
      />

      <StatusBanner
        tone="info"
        icon={<Sparkles />}
        title="Theme is a constraint, not a redesign target."
        description="Core background, foreground, primary, secondary, muted, accent, destructive, card, popover, chart, sidebar, and base-radius values remain unchanged. Semantic state and sizing tokens are additive."
      />

      <ContentSection
        title="Foundation contract"
        description="These defaults keep controls and page composition predictable across Web, Admin, Docs, and future first-party products."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {foundation.map((item) => (
            <Card key={item.label} size="sm">
              <CardHeader>
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="text-2xl tabular-nums">
                  {item.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {item.detail}
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        title="Semantic state"
        description="Application code communicates meaning with semantic tokens instead of literal color names."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {semanticStates.map((state) => (
            <Card key={state.name} size="sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className={`size-8 rounded-lg ${state.className}`}
                  />
                  <code className="text-xs text-muted-foreground">
                    {state.token}
                  </code>
                </div>
                <CardTitle>{state.name}</CardTitle>
                <CardDescription>{state.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <EntityStatus tone="info">Informational</EntityStatus>
          <EntityStatus tone="success">Verified</EntityStatus>
          <EntityStatus tone="warning">Needs attention</EntityStatus>
          <EntityStatus tone="danger">Critical</EntityStatus>
        </div>
      </ContentSection>

      <ContentSection
        title="Control geometry"
        description="Use component sizes rather than one-off heights. Default controls are 40px; prominent actions are 44px."
      >
        <Card>
          <CardContent className="grid gap-6 py-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="text-sm font-medium">Button sizes</div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs" variant="outline">
                  Extra small
                </Button>
                <Button size="sm" variant="outline">
                  Small
                </Button>
                <Button>Default</Button>
                <Button size="lg">Large action</Button>
              </div>
            </div>
            <div className="space-y-3">
              <label
                htmlFor="design-system-input"
                className="text-sm font-medium"
              >
                Default field
              </label>
              <Input
                id="design-system-input"
                placeholder="40px control · 8px radius"
                readOnly
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Keep labels visible and use semantic danger states for
                validation.
              </p>
            </div>
          </CardContent>
        </Card>
      </ContentSection>

      <ContentSection
        title="Page archetypes"
        description="Density changes by context; the component language does not."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {pageArchetypes.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-5" />
                </span>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="leading-6">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        title="Non-negotiable rules"
        description="These constraints prevent visual drift while leaving room for domain-specific composition."
      >
        <Card>
          <CardContent className="grid gap-4 py-6 md:grid-cols-2">
            {[
              "Keep core light/dark theme values unchanged unless a deliberate theme migration is approved.",
              "Use success, warning, info, and danger for status instead of literal palette utilities.",
              "Use 8px controls, 10px menus/alerts, and 12px cards as the normal radius hierarchy.",
              "Use horizontal rules only where information structure requires them; never as public-page decoration.",
              "Keep keyboard focus visible and preserve primitive-provided focus management.",
              "Extract a ui-pattern only after the structure is stable and genuinely reusable across screens.",
            ].map((rule) => (
              <div key={rule} className="flex gap-3 rounded-lg bg-muted/40 p-4">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                <p className="text-sm leading-6 text-muted-foreground">
                  {rule}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </ContentSection>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">docs/design-system.md</Badge>
        <Badge variant="outline">docs/ui-patterns-guide.md</Badge>
        <Badge variant="outline">packages/ui</Badge>
        <Badge variant="outline">packages/ui-patterns</Badge>
      </div>
    </div>
  )
}
