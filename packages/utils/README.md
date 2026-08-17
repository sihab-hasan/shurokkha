# `@shurokkha/utils`

Small, framework-agnostic utility functions shared across the workspace.

## Current API

```ts
import { isDefined } from "@shurokkha/utils"

const values = ["water", null, "medicine"].filter(isDefined)
```

`isDefined` is a type guard that removes `null` and `undefined`. Domain-specific logic should live in a focused package instead of becoming a generic utility.

## Validate

```bash
pnpm --filter @shurokkha/utils lint
pnpm --filter @shurokkha/utils typecheck
```
