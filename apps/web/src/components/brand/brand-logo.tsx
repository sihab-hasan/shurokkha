import Image from "next/image"
import Link from "next/link"

import { cn } from "@shurokkha/ui/lib/utils"

import { publicSiteConfig } from "@/config/public-site-config"

interface BrandLogoProps {
  className?: string
  priority?: boolean
  showTagline?: boolean
}

export function BrandLogo({
  className,
  priority = false,
  showTagline = true,
}: BrandLogoProps) {
  return (
    <Link
      href={publicSiteConfig.brand.href}
      aria-label={`${publicSiteConfig.brand.name} home`}
      className={cn(
        "flex items-center gap-3 whitespace-nowrap transition-opacity hover:opacity-90",
        className
      )}
    >
      <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-white shadow-xs ring-1 ring-border">
        <Image
          src={publicSiteConfig.brand.logoSrc}
          alt=""
          fill
          sizes="48px"
          priority={priority}
          className="scale-[1.0] object-cover object-[50%_27%]"
        />
      </span>

      <span className="flex min-w-0 flex-col leading-tight">
        <span className="font-heading text-lg font-bold tracking-tight">
          {publicSiteConfig.brand.name}
        </span>
        {showTagline ? (
          <span className="text-xs text-muted-foreground">
            {publicSiteConfig.brand.tagline}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
