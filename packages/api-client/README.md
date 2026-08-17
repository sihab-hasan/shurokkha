# `@shurokkha/api-client`

Shared boundary for frontend-to-backend API access.

## Current API

The package currently exports `ApiClientOptions` and `createApiClient`. The function returns the supplied configuration; it does not perform HTTP requests yet.

```ts
import { createApiClient } from "@shurokkha/api-client"

const api = createApiClient({
  baseUrl: "http://localhost:5000",
})
```

## Intended direction

When a backend exists, this package should own shared request configuration, typed endpoints, error normalization, and transport concerns. Domain UI and server implementation details should remain outside this package.

## Validate

```bash
pnpm --filter @shurokkha/api-client lint
pnpm --filter @shurokkha/api-client typecheck
```
