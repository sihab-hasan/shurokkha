# Documentation App

`@shurokkha/docs` is the Next.js application reserved for product documentation and public content.

## Run locally

From the repository root:

```bash
pnpm --filter @shurokkha/docs dev
```

Open `http://localhost:3001/docs`. The app uses the `/docs` base path.

When all apps are running with `pnpm dev`, it is also available through the public web entry point at `http://localhost:3000/docs`.

## Scripts

```bash
pnpm --filter @shurokkha/docs dev
pnpm --filter @shurokkha/docs build
pnpm --filter @shurokkha/docs start
pnpm --filter @shurokkha/docs lint
pnpm --filter @shurokkha/docs typecheck
pnpm --filter @shurokkha/docs format
```

## Shared UI

The app imports global styling and reusable components from `@shurokkha/ui`. Keep general repository documentation in the root `docs/` directory; use this application for content that must be rendered as part of the product.

## Current status

The app currently contains a scaffold page. Its information architecture and publishing workflow have not been defined yet.
