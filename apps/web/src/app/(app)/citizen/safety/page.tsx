import type { Metadata } from "next"
import { AppCollectionPage } from "@/components/app/app-collection-page"
export const metadata: Metadata = { title: "Safety Instructions" }
export default function CitizenSafetyPage() {
  return (
    <AppCollectionPage
      title="Safety instructions"
      description="Practical guidance for preparing, evacuating, and requesting help."
      items={[
        {
          title: "Before evacuation",
          description:
            "Pack identification, medicine, water, a phone charger, and essential documents.",
        },
        {
          title: "During flooding",
          description:
            "Avoid moving water, damaged roads, and disconnected electrical lines.",
        },
        {
          title: "At a shelter",
          description:
            "Register your household and report medical or accessibility needs.",
        },
        {
          title: "When requesting help",
          description:
            "Share a precise location and describe immediate risks clearly.",
        },
      ]}
      asideTitle="Emergency contacts"
      asideDescription="Keep local emergency services and a trusted household contact available offline."
    />
  )
}
