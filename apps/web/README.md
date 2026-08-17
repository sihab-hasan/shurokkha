# Public Web App

`@shurokkha/web` is the public-facing Next.js application and the primary local entry point for Shurokkha.

## Run locally

From the repository root:

```bash
pnpm --filter @shurokkha/web dev
```

Open `http://localhost:3000`.

Run `pnpm dev` instead when you also need the documentation and admin applications. With all three servers running, the web app forwards:

- `/docs/*` to the docs app on port `3001`
- `/admin/*` to the admin app on port `3003`

The `/client/*` rewrite is reserved for a future client portal; no client workspace currently exists.

## Scripts

```bash
pnpm --filter @shurokkha/web dev
pnpm --filter @shurokkha/web build
pnpm --filter @shurokkha/web start
pnpm --filter @shurokkha/web lint
pnpm --filter @shurokkha/web typecheck
pnpm --filter @shurokkha/web format
```

## Shared UI

The app consumes components and theme styles from `@shurokkha/ui`:

```tsx
import { Button } from "@shurokkha/ui/components/button"
```

`src/styles/app.css` imports the shared global stylesheet. Add shadcn components from this workspace so the CLI resolves monorepo paths correctly:

```bash
cd apps/web
pnpm dlx shadcn@latest add button
```

## Current status

The app currently contains a scaffold landing page. Public disaster-relief discovery, requests, donations, and volunteer flows are planned work.
