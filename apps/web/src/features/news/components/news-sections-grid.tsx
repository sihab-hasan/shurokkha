import { BookOpen, Megaphone, Newspaper } from "lucide-react"

import { NewsSectionCard } from "./news-section-card"

const SECTIONS = [
  {
    title: "Response updates",
    description:
      "Live situation summaries tied to active disasters, affected areas, and shelter availability.",
    icon: Megaphone,
    href: "/disasters",
  },
  {
    title: "Recovery stories",
    description:
      "Long-form pieces about communities moving from response into resilience after a verified disaster.",
    icon: BookOpen,
    href: "/transparency",
  },
  {
    title: "Platform news",
    description:
      "Releases about Shurokkha features, accessibility, transparency, and policy updates.",
    icon: Newspaper,
    href: "/about",
  },
] as const

/**
 * 3-up grid of `NewsSectionCard`s enumerating the three news lenses on
 * `/news`.
 */
export function NewsSectionsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {SECTIONS.map((section) => (
        <NewsSectionCard key={section.title} {...section} />
      ))}
    </div>
  )
}
