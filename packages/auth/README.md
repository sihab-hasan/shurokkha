# `@shurokkha/auth`

Framework-agnostic authentication and authorization helpers shared across Shurokkha applications.

## Current API

```ts
import { hasRole } from "@shurokkha/auth"

const canAdminister = hasRole(["user", "admin"], "admin")
```

`hasRole(userRoles, requiredRole)` performs a simple exact role check. The package is not connected to an authentication provider and does not manage sessions or tokens.

## Intended direction

Keep stable role and authorization rules here when multiple workspaces need them. Provider-specific adapters should be introduced only after an identity solution is selected.

## Validate

```bash
pnpm --filter @shurokkha/auth lint
pnpm --filter @shurokkha/auth typecheck
```
