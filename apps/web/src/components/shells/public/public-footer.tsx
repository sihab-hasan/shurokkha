import Link from "next/link"
import { ArrowRight, MapPinned, Siren } from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"

import { BrandLogo } from "@/components/brand/brand-logo"
import { publicSiteConfig } from "@/config/public-site-config"
import { routes } from "@/config/routes"

import { PublicContainer } from "./public-container"

export default function PublicFooter() {
  return (
    <footer className="bg-muted/40 text-foreground">
      <PublicContainer className="py-10 sm:py-12 lg:py-16">
        <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Need support now?
            </p>
            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Start with the action that matches your situation.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Request assistance, find a nearby shelter, or review verified
              emergency information before taking your next step.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 lg:mt-0 lg:justify-end">
            <Button
              nativeButton={false}
              size="lg"
              render={<Link href={routes.public.getHelp} />}
            >
              <Siren data-icon="inline-start" />
              Request help
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              size="lg"
              render={<Link href={routes.public.shelters} />}
            >
              <MapPinned data-icon="inline-start" />
              Find shelters
            </Button>
          </div>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[1.35fr_2.65fr] lg:gap-16 lg:py-16">
          <div className="max-w-sm">
            <BrandLogo
              showTagline={false}
              className="[&>span:first-child]:size-11"
            />
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Shurokkha brings trusted disaster information, assistance
              pathways, shelters, resources, and community participation into
              one connected experience so people can make clearer decisions
              before, during, and after an emergency.
            </p>
            <Link
              href={routes.public.howItWorks}
              className="mt-5 inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              See how Shurokkha works
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-4">
            {publicSiteConfig.footerItems.map((group) => (
              <nav key={group.title} aria-label={`${group.title} links`}>
                <h2 className="font-heading text-sm font-semibold text-foreground">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={`${item.label}-${item.href}`}>
                      <Link
                        href={item.href}
                        className="inline-flex min-h-8 items-center rounded-sm text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:outline-none"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-card/70 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {publicSiteConfig.brand.name}. Built
            for clearer community response and recovery.
          </p>
          <nav
            aria-label="Legal"
            className="mt-3 flex flex-wrap gap-x-5 gap-y-2 sm:mt-0 sm:justify-end"
          >
            {publicSiteConfig.legalItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-8 items-center rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </PublicContainer>
    </footer>
  )
}
