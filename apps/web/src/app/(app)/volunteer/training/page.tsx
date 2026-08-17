import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Volunteer Training" }
export default function VolunteerTrainingPage() {
  return (
    <AppCollectionPage
      title="Training"
      description="Complete the preparation required for safe response work."
      items={[
        {
          title: "Field safety essentials",
          href: "/volunteer/training/training-safety-001",
          description: "Core safety procedures for disaster response.",
          status: "Complete",
        },
        {
          title: "Shelter intake and safeguarding",
          href: "/volunteer/training/training-shelter-002",
          description: "Required for shelter support assignments.",
          status: "In progress",
        },
        {
          title: "First-aid refresher",
          href: "/volunteer/training/training-first-aid-003",
          description: "Practical refresher session · 28 May",
          status: "Scheduled",
        },
      ]}
      asideTitle="Certification"
      asideDescription="Completed training is recorded automatically in your volunteer profile."
    />
  )
}
