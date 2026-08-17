# Project Overview

Shurokkha is a pnpm/Turborepo TypeScript monorepo for disaster-relief coordination.

## Applications

| App   | Package            | Purpose                                                   | Dev port |
| ----- | ------------------ | --------------------------------------------------------- | -------: |
| Web   | `@shurokkha/web`   | Public site, auth flows and citizen/donor/volunteer areas |     3000 |
| Docs  | `@shurokkha/docs`  | Product/design-system documentation                       |     3001 |
| Admin | `@shurokkha/admin` | Internal operations/admin workspace                       |     3003 |

## Shared package responsibilities

- `@shurokkha/ui`: domain-agnostic primitives, theme infrastructure, providers, generic UI helpers.
- `@shurokkha/ui-patterns`: reusable application-level shells, layouts and interaction patterns.
- `@shurokkha/icons`: product-semantic icon aliases.
- `@shurokkha/contracts`: stable cross-workspace TypeScript contracts.
- `@shurokkha/validation`: shared runtime schemas.
- `@shurokkha/auth`, `@shurokkha/permissions`: reusable auth/authorization helpers without a production identity provider.
- `@shurokkha/api-client`: transport boundary prepared for a future real API.
- `@shurokkha/utils`: framework-agnostic utilities.

## Web route model

- `(public)` → `PublicShell`; public pages own `ContentContainer`.
- `(auth)` → Web `AuthShell` → shared auth shell pattern.
- `(app)` → role layout → Web `AppShell` → shared `WorkspaceShell`.

Four public experiences currently have full route composition: About, How Shurokkha Works, Contact and Public Profile. Other public routes can remain lightweight scaffolds until their design is intentionally implemented.

## Current infrastructure boundary

`services/` is reserved for a real deployable backend. Do not create a placeholder API/service. No database, cache, email provider, hosting provider or production auth integration is configured.
