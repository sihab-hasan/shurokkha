# Admin App

`@shurokkha/admin` is the internal Next.js application for future Shurokkha administration and coordination workflows.

## Run locally

From the repository root:

```bash
pnpm --filter @shurokkha/admin dev
```

Open `http://localhost:3003/admin`. The app uses the `/admin` base path.

When all apps are running with `pnpm dev`, it is also available through the public web entry point at `http://localhost:3000/admin`.

## Scripts

```bash
pnpm --filter @shurokkha/admin dev
pnpm --filter @shurokkha/admin build
pnpm --filter @shurokkha/admin start
pnpm --filter @shurokkha/admin lint
pnpm --filter @shurokkha/admin typecheck
pnpm --filter @shurokkha/admin format
```

## Shared UI

The app imports global styling and reusable components from `@shurokkha/ui`. Administration-specific pages and flows should remain in this workspace; only stable cross-app primitives belong in the shared package.

## Current status

The app currently contains a scaffold page. Authentication, authorization, audit logging, and operational dashboards are not implemented yet.
