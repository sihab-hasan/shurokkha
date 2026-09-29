# Agent instructions

This file is the repository entry point for coding agents. Read `.agents/README.md` for the detailed repository-local context.

## Non-negotiable boundaries

- Treat source code, package manifests and current configuration as the source of truth.
- Do not invent backend services, environment variables, APIs, hosting providers or production integrations.
- `apps/*` owns application routes, domain UI and branded shells.
- `packages/ui` is domain-agnostic primitive UI/infrastructure; product-semantic icons ship inside `@shurokkha/ui/icons/*`.
- `packages/contracts` owns cross-workspace TypeScript types; Zod runtime validation lives in `@shurokkha/contracts/validation.ts` (re-exported via `@shurokkha/validation`).
- `packages/auth` owns role/permission helpers (`hasRole`, `hasPermission`, `hasAnyPermission`).
- `packages/api-client` is the only thing that talks to the Laravel backend; never `fetch()` the API directly from an app.
- Next.js `layout.tsx` is a routing boundary; `*Shell` owns visual chrome.
- Web route groups are `(public)`, `(auth)` and `(account)`.
- Use focused subpath imports for `@shurokkha/ui` (e.g. `@shurokkha/ui/components/button`).
- Keep route `page.tsx` files thin; put reusable app composition in `src/components`.

## Validation

Run `pnpm verify` before considering repository-wide work complete. For focused changes, run the affected workspace checks plus `pnpm check:architecture`, `pnpm check:api-connections`, and `pnpm check:web-pages` during iteration.
