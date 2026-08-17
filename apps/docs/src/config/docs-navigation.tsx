import {
  AppWindow,
  Blocks,
  BookOpenCheck,
  Component,
  FileCode2,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

export const docsNavigation = [
  { label: "Overview", href: "/", icon: BookOpenCheck },
  { label: "Architecture", href: "/architecture", icon: AppWindow },
  { label: "Design system", href: "/design-system", icon: Sparkles },
  { label: "UI primitives", href: "/ui", icon: Component },
  { label: "UI patterns", href: "/patterns", icon: Blocks },
  { label: "Application guide", href: "/applications", icon: FileCode2 },
  { label: "Accessibility", href: "/accessibility", icon: ShieldCheck },
] as const
