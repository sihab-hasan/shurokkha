import Link from "next/link"
import { ArrowUpRight, RadioTower } from "lucide-react"

import { publicSiteConfig } from "@/config/public-site-config"

import { PublicContainer } from "./public-container"

export default function PublicTopbar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <PublicContainer className="flex min-h-10 items-center justify-between gap-4 py-2">
        <p className="hidden min-w-0 items-center gap-2 text-xs font-medium sm:flex lg:text-sm">
          <RadioTower className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{publicSiteConfig.announcement}</span>
        </p>

        <nav
          aria-label="Emergency information"
          className="ml-auto flex shrink-0 items-center gap-4 text-xs font-semibold sm:text-sm"
        >
          {publicSiteConfig.utilityItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground/40 focus-visible:outline-none"
            >
              {item.label}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </PublicContainer>
    </div>
  )
}
