import { BookOpen, LifeBuoy, PackageOpen } from "lucide-react"

import { ResourceCategoryCard } from "./resource-category-card"

const RESOURCE_CATEGORIES = [
  {
    title: "Emergency guides",
    description:
      "Step-by-step preparation, response, evacuation, and recovery guides published by Shurokkha and verified against official Bangladesh guidance.",
    icon: BookOpen,
    href: "/resources/guides",
  },
  {
    title: "Support services",
    description:
      "Coordinated support services for emergency assistance, food and supplies, medical support, and recovery pathways.",
    icon: LifeBuoy,
    href: "/resources/support-services",
  },
  {
    title: "Relief supplies",
    description:
      "Real-time shelter and supply hub availability — capacity, occupancy, and what each hub is currently distributing.",
    icon: PackageOpen,
    href: "/shelters",
  },
] as const

/**
 * 3-up grid of `ResourceCategoryCard`s rendered on `/resources` to
 * deep-link visitors into the resource library sub-pages.
 */
export function ResourceCategoriesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {RESOURCE_CATEGORIES.map((category) => (
        <ResourceCategoryCard key={category.title} {...category} />
      ))}
    </div>
  )
}
