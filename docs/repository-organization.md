# Repository organization

## Dependency direction

```text
apps/*
  -> @shurokkha/ui                       (primitives, theme, icons)
  -> framework-agnostic shared packages  (contracts, auth, api-client, validation)
```

Applications never import source from another application. Shared code moves into a focused package only when it has a real cross-application responsibility.

> **Note.** `@shurokkha/ui-patterns`, `@shurokkha/icons`, `@shurokkha/permissions` and `@shurokkha/utils` are described in some legacy docs but do **not** ship as separate workspace packages. Icons ship inside `@shurokkha/ui` (import via `@shurokkha/ui/icons/*`); composition lives inside each app; role checks live inside `@shurokkha/auth`; small generic helpers live alongside their consumers. Do not create stub packages — only lift code into a new package when at least two workspaces need to consume it.

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

| Layer                   | Owns                                                                                                                                                                  | Must not own                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `@shurokkha/ui`         | shadcn/Base UI primitives, theme tokens, `cn`, generic hooks, `UiProvider`, generic controls such as `ThemeSwitcher`, product-semantic icon aliases (under `icons/*`) | route logic, business logic, API entities              |
| `@shurokkha/contracts`  | Cross-workspace TypeScript contracts (records, inputs, enums)                                                                                                         | Zod schemas that live in `validation.ts`               |
| `@shurokkha/validation` | Re-export of Zod schemas owned by `@shurokkha/contracts/validation`                                                                                                   | New schemas — add to contracts and re-export           |
| `@shurokkha/api-client` | Typed transport layer (one slice per backend domain)                                                                                                                  | React components, hooks                                |
| `@shurokkha/auth`       | `hasRole`, `hasPermission`, `hasAnyPermission`, role/permission helpers                                                                                               | UI components                                          |
| `apps/*/src/components` | application-specific composition and business-facing UI                                                                                                               | generic primitives already supplied by shared packages |

## Package imports

`@shurokkha/ui` intentionally exposes focused subpaths instead of large root barrels.

```ts
import { Button } from "@shurokkha/ui/components/button"
import { cn } from "@shurokkha/ui/lib/utils"
import { AlertIcon } from "@shurokkha/ui/icons/alert-icon"
import { Container } from "@shurokkha/ui/layout/container"
```

This keeps dependencies explicit and avoids mixing client-heavy modules through a root barrel.

## Shared package map

The following workspace packages currently exist:

- `api-client` — frontend transport boundary (one typed slice per backend domain).
- `auth` — framework-agnostic role/permission helpers (`hasRole`, `hasPermission`, `hasAnyPermission`).
- `contracts` — cross-workspace TypeScript contracts (records, inputs, enums) plus Zod schemas in `validation.ts`.
- `ui` — primitive visual system, theme tokens, `UiProvider`, generic hooks, and product-semantic icon aliases (under `icons/*`).
- `validation` — thin re-export of `@shurokkha/contracts/validation` for the documented import path.
- `tooling/*` — ESLint, Prettier and TypeScript configuration packages.

> **Not shipped as packages today (legacy references in earlier docs):** `icons`, `ui-patterns`, `permissions`, `utils`. See the note at the top of this document.

Do not create placeholder folders/packages. Add a package or service when it has real ownership, an entrypoint and validation scripts.

## Validation

Run:

```bash
pnpm check:architecture
pnpm check:api-connections
pnpm check:web-pages
pnpm verify
```

`pnpm verify` is the aggregator — it runs lint, typecheck, test, format check, build, and all three `check:*` guards. `check:architecture` enforces workspace import boundaries; `check:api-connections` audits api-client ↔ Laravel parity; `check:web-pages` flags `page.tsx` files that do not import from `@shurokkha/api-client` (and are not on the static allowlist).
