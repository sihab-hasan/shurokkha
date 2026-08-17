# `@shurokkha/validation`

Reusable runtime validation schemas built with Zod.

## Current API

```ts
import { idSchema } from "@shurokkha/validation"

const id = idSchema.parse("resource-123")
```

`idSchema` currently accepts any non-empty string. Add schemas here when multiple workspaces must enforce the same request or domain contract.

## Validate

```bash
pnpm --filter @shurokkha/validation lint
pnpm --filter @shurokkha/validation typecheck
```
