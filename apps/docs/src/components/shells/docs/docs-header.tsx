import Link from "next/link"
import { BookOpenCheck, GitFork, Search, ShieldCheck } from "lucide-react"

import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shurokkha/ui/components/input-group"

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <ContentContainer
        size="wide"
        padded={false}
        className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold">Shurokkha Docs</span>
            <span className="block text-[11px] text-muted-foreground">
              Product & engineering system
            </span>
          </span>
        </Link>

        <div className="mx-auto hidden w-full max-w-xl md:block">
          <InputGroup>
            <InputGroupInput
              aria-label="Search documentation"
              placeholder="Search patterns, APIs, guides..."
            />
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupAddon
              align="inline-end"
              className="text-[11px] text-muted-foreground"
            >
              ⌘ K
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:inline-flex">
            v0.1 design system
          </Badge>
          <Button variant="ghost" size="icon" aria-label="Repository">
            <GitFork />
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/patterns" />}
            className="hidden sm:inline-flex"
          >
            <BookOpenCheck /> Browse patterns
          </Button>
        </div>
      </ContentContainer>
    </header>
  )
}
