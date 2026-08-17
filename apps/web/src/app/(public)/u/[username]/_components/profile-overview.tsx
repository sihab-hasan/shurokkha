"use client"

import {
  Award,
  BadgeCheck,
  Clock3,
  HandHeart,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react"

import { ActivityFeed } from "@shurokkha/ui-patterns/activity"
import { EntitySummary } from "@shurokkha/ui-patterns/entity"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shurokkha/ui/components/tabs"

const badges = [
  { title: "Helper", level: "Level 2", icon: Award },
  { title: "Prepared", level: "Level 1", icon: ShieldCheck },
  { title: "Community", level: "Level 1", icon: BadgeCheck },
]

const activities = [
  {
    id: "shelter-support",
    title: "Completed shelter support shift",
    description: "Riverside Community Center · 4 hours",
    icon: <HandHeart className="size-4" />,
    timestamp: "Recently",
  },
  {
    id: "relief-supplies",
    title: "Helped distribute relief supplies",
    description: "Westview supply hub · 3 hours",
    icon: <PackageCheck className="size-4" />,
    timestamp: "This month",
  },
  {
    id: "safety-training",
    title: "Completed safety training",
    description: "Community response essentials",
    icon: <ShieldCheck className="size-4" />,
    timestamp: "This year",
  },
]

interface ProfileOverviewProps {
  bio: string
  location: string
  hours: number
  missions: number
  peopleHelped: number
}

export function ProfileOverview({
  bio,
  location,
  hours,
  missions,
  peopleHelped,
}: ProfileOverviewProps) {
  const impact = [
    { label: "Volunteer hours", value: hours },
    { label: "Missions joined", value: missions },
    { label: "People helped", value: peopleHelped },
  ]

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card className="gap-0 py-0 shadow-xs">
        <Tabs defaultValue="overview" className="gap-0">
          <CardHeader className="px-5 pt-5 sm:px-8 sm:pt-6">
            <TabsList className="w-full justify-center">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="overview">
            <CardHeader className="px-5 pt-6 sm:px-8">
              <CardTitle>About</CardTitle>
              <CardDescription className="max-w-2xl leading-6">
                {bio}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 py-6 sm:grid-cols-2 sm:px-8">
              <div className="flex items-center gap-3 rounded-xl bg-muted/55 p-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-background text-primary shadow-xs">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Location
                  </p>
                  <p className="mt-0.5 font-medium">{location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted/55 p-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-background text-primary shadow-xs">
                  <Clock3 className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Volunteered
                  </p>
                  <p className="mt-0.5 font-medium">{hours} hours</p>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="activity">
            <CardContent className="py-6 sm:px-8">
              <ActivityFeed items={activities} />
            </CardContent>
          </TabsContent>

          <TabsContent value="badges">
            <CardContent className="grid gap-4 py-6 sm:grid-cols-3 sm:px-8">
              {badges.map(({ title, level, icon: Icon }) => (
                <Card
                  key={title}
                  size="sm"
                  className="items-center bg-muted/35 text-center shadow-none"
                >
                  <CardHeader className="items-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <CardTitle className="mt-2">{title}</CardTitle>
                    <CardDescription>{level}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      <EntitySummary
        title="Community impact"
        description="A snapshot of approved public contributions."
        footer="Only public contribution metrics approved for display are included."
      >
        <div className="grid gap-3">
          {impact.map((item) => (
            <div key={item.label} className="rounded-lg bg-muted/45 p-4">
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
              <strong className="mt-1 block font-heading text-2xl font-semibold tabular-nums">
                {item.value}
              </strong>
            </div>
          ))}
        </div>
      </EntitySummary>
    </div>
  )
}
