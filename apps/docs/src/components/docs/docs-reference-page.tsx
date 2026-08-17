import Link from "next/link"
import {
  ArrowLeft,
  Blocks,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  Component,
  Layers3,
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
import { StatusBanner } from "@shurokkha/ui-patterns/feedback"
import { ContentSection } from "@shurokkha/ui-patterns/layout"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"

function humanize(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

export interface DocsReferencePageProps {
  slug: string[]
}

export function DocsReferencePage({ slug }: DocsReferencePageProps) {
  const title = slug.map(humanize).join(" / ") || "Documentation"
  const isPattern = slug[0] === "patterns"
  const Icon = isPattern ? Blocks : slug[0] === "ui" ? Component : Layers3

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={isPattern ? "UI pattern reference" : "Documentation"}
        title={title}
        description="Reference scaffold for the Shurokkha product system. Add examples and API details here as the capability matures."
        metadata={
          <>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> Shared design language
            </span>
            <span>App-agnostic guidance</span>
          </>
        }
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ArrowLeft /> Docs overview
          </Button>
        }
      />

      <StatusBanner
        tone="info"
        icon={<Icon />}
        title="Reference pages are intentionally implementation-neutral."
        description="Examples should demonstrate reusable interaction structure. Domain rules and API entities remain documented with their owning application or service."
      />

      <ContentSection
        title="Reference structure"
        description="Use this consistent format as detailed documentation is added."
      >
        <CollectionView>
          <CollectionGrid columns={3}>
            {[
              {
                icon: BookOpenCheck,
                title: "Purpose",
                description:
                  "When this capability should be used and what problem it solves.",
              },
              {
                icon: Code2,
                title: "API & composition",
                description:
                  "Props, supported composition points, states and recommended imports.",
              },
              {
                icon: Component,
                title: "Examples",
                description:
                  "Responsive, accessible examples covering normal and edge states.",
              },
            ].map((item, index) => (
              <Card key={item.title}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon />
                    </span>
                    <Badge variant="outline">0{index + 1}</Badge>
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <code className="text-xs text-muted-foreground">
                    @shurokkha/{isPattern ? "ui-patterns" : "ui"}
                  </code>
                </CardContent>
              </Card>
            ))}
          </CollectionGrid>
        </CollectionView>
      </ContentSection>
    </div>
  )
}
