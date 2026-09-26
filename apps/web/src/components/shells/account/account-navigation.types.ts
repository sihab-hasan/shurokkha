import type { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export interface NavModule {
  id: string
  label: string
  href: string
  icon: LucideIcon
  sections: Array<{ items: NavItem[] }>
}
