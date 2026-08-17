# `@shurokkha/ui`

Shared visual system for all Shurokkha applications.

## Responsibilities

- shadcn/ui component source
- Tailwind CSS 4 global theme and semantic tokens
- shared PostCSS configuration
- the `cn` class-name utility
- reusable UI hooks and primitives
- shared `UiProvider` and generic controls such as `ThemeSwitcher`

## Usage

```tsx
import { Button } from "@shurokkha/ui/components/button"
import { cn } from "@shurokkha/ui/lib/utils"
import { ThemeSwitcher } from "@shurokkha/ui/components/theme-switcher"
import { UiProvider } from "@shurokkha/ui/providers/ui-provider"
```

Each application imports the shared theme through its local `src/styles/app.css`:

```css
@import "@shurokkha/ui/globals.css";
@import "@shurokkha/ui-patterns/ui-patterns.css";
```

## shadcn workflow

Run the CLI from a consuming application workspace. The monorepo aliases route shared UI components into this package.

```bash
cd apps/web
pnpm dlx shadcn@latest add button
```

All `components.json` files that target this package must keep the same style (`base-luma`), icon library (`lucide`), and base color (`neutral`). Review generated files before committing updates.

## Validate

```bash
pnpm --filter @shurokkha/ui lint
pnpm --filter @shurokkha/ui typecheck
```

## Boundary

Keep this package domain-agnostic. Product-semantic icons live in `@shurokkha/icons`; application workflows and screen compositions live in `@shurokkha/ui-patterns` or the consuming application. Use focused subpath imports rather than a root barrel.
