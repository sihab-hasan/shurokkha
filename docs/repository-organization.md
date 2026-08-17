# Repository organization

## Dependency direction

```text
apps/*
  -> @shurokkha/ui-patterns
      -> @shurokkha/ui
  -> @shurokkha/icons
  -> framework-agnostic shared packages
```

Applications never import source from another application. Shared code moves into a focused package only when it has a real cross-application responsibility.

## Application source layout

```text
src/
  app/          Next.js routes, layouts, loading/error boundaries
  components/   reusable application-owned React composition
  config/       static application configuration/navigation
```

Use route-private `_components` only when a component is truly local to one route subtree. Cross-route compositions belong in `src/components`.

`page.tsx` and `layout.tsx` stay thin. They resolve route parameters/data and mount a named component or shell; large visual implementations do not live in route files.

Imports use `@/* -> ./src/*`, so application code imports `@/components/...`, never `@/src/components/...`.

## Component ownership

| Layer                    | Owns                                                                                                                 | Must not own                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `@shurokkha/ui`          | shadcn/Base UI primitives, theme tokens, `cn`, generic hooks, `UiProvider`, generic controls such as `ThemeSwitcher` | product entities, workflows, Shurokkha semantic icons  |
| `@shurokkha/icons`       | semantic product icon aliases such as `ShelterIcon` and `DonationIcon`                                               | layouts, state, business logic                         |
| `@shurokkha/ui-patterns` | reusable shells, page structure, collections, entity views, forms, feedback, workflow, reporting, messaging          | route logic, API entities, product-specific cards      |
| `apps/*/src/components`  | application-specific composition and business-facing UI                                                              | generic primitives already supplied by shared packages |

## Package imports

`@shurokkha/ui` and `@shurokkha/ui-patterns` intentionally expose focused subpaths instead of large root barrels.

```ts
import { Button } from "@shurokkha/ui/components/button"
import { cn } from "@shurokkha/ui/lib/utils"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
```

This keeps dependencies explicit and avoids mixing client-heavy modules through a root barrel.

## Shared package map

- `api-client` — frontend transport boundary when an API exists.
- `auth` — framework-agnostic auth/role helpers.
- `contracts` — cross-workspace TypeScript contracts.
- `icons` — semantic Shurokkha icon aliases.
- `permissions` — permission/capability helpers.
- `ui` — primitive visual system and theme infrastructure.
- `ui-patterns` — reusable application-level composition patterns.
- `utils` — small framework-agnostic utilities.
- `validation` — shared Zod schemas.
- `tooling/*` — ESLint, Prettier and TypeScript configuration packages.

Do not create placeholder folders/packages. Add a package or service when it has real ownership, an entrypoint and validation scripts.

## Validation

Run:

```bash
pnpm check:repo
pnpm check:shells
pnpm check:web-ui
pnpm check:architecture
```

`check:architecture` runs the repository, shell and web UI architecture guards together.
