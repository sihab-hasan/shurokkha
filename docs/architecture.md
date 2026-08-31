# Architecture

## Overview

Shurokkha is a pnpm/Turborepo monorepo with two Next.js applications and focused internal packages.

```text
apps/
  web/            public, authentication and signed-in product experiences
  admin/          internal administration workspace

packages/
  api-client/     future typed transport boundary
  auth/           shared role/auth helpers
  contracts/      cross-workspace TypeScript contracts
  icons/          semantic Shurokkha icon aliases
  permissions/    shared authorization helpers
  ui/             primitive UI system, theme and generic UI infrastructure
  ui-patterns/    reusable application patterns and shells
  utils/          framework-agnostic utilities
  validation/     shared runtime validation

tooling/
  eslint-config/
  prettier-config/
  typescript-config/

services/         reserved for real deployable backend services
```

## Applications

| Application | Package            | Dev port | Base path | Responsibility                              |
| ----------- | ------------------ | -------: | --------- | ------------------------------------------- |
| Web         | `@shurokkha/web`   |     3000 | `/`       | Public site, auth flows and role workspaces |
| Admin       | `@shurokkha/admin` |     3003 | `/admin`  | Internal operations and administration      |

The web app proxies `/admin/*` to the local Admin application during development. `/client/*` remains reserved; there is no client app yet. Durable project and design-system documentation lives in the root `docs/` directory.

## UI dependency model

```text
application-specific composition
        ↓
@shurokkha/ui-patterns
        ↓
@shurokkha/ui
```

`@shurokkha/icons` is a sibling shared package for product-semantic icon aliases. Keeping these icons outside `@shurokkha/ui` prevents the primitive design system from learning domain concepts.

`@shurokkha/ui` owns shared global Tailwind/theme CSS, primitives, `UiProvider`, `ThemeSwitcher`, generic hooks and utility functions. `@shurokkha/ui-patterns` owns reusable application structure such as workspace shells, collections, entity screens, forms, feedback and reporting. Domain UI remains inside applications.

Every application imports both shared CSS surfaces from its local `src/styles/app.css`.

## Route and shell model

Root layouts own document metadata, fonts, global CSS and `UiProvider`. Route-group layouts mount visual shells.

Web uses:

```text
(public) -> PublicShell
(auth)   -> AuthShell
(app)    -> role layout -> AppShell -> WorkspaceShell
```

Admin uses `(app) -> AdminShell`.

Experience shells own semantic `<main>` regions. `ContentContainer` handles non-semantic width/gutters. The old `PageContainer` abstraction has been removed to avoid nested main elements.

See [Shell architecture](shell-architecture.md) for the detailed contract.

## Import boundaries

Application aliases resolve `@/*` directly to `src/*`. Use `@/components/...`, not `@/src/components/...`.

Shared UI packages use focused exports:

```ts
import { Button } from "@shurokkha/ui/components/button"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
```

Large root barrels are intentionally not exposed for `ui` or `ui-patterns`.

## Backend boundary

The standardized Laravel backend service is located in `services/api/`. It provides endpoints for Citizen authentication, assistance requests, and missing-person reports. Applications consume this backend through explicit API service boundaries, while shared packages (such as contracts, validation, and api-client) remain framework-agnostic.

## Automated architecture guards

- `pnpm check:repo` — repository/package/component ownership.
- `pnpm check:shells` — shell and route-group ownership.
- `pnpm check:web-ui` — public/app/auth page composition rules.
- `pnpm check:architecture` — runs all architecture guards.

See [Repository organization](repository-organization.md) for placement rules.
