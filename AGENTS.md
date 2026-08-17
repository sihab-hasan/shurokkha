# Agent instructions

This file is the repository entry point for coding agents. Read `.agents/README.md` for the detailed repository-local context.

## Non-negotiable boundaries

- Treat source code, package manifests and current configuration as the source of truth.
- Do not invent backend services, environment variables, APIs, hosting providers or production integrations.
- `apps/*` owns application routes, domain UI and branded shells.
- `packages/ui` is domain-agnostic primitive UI/infrastructure.
- `packages/ui-patterns` is reusable application-level composition.
- `packages/icons` contains product-semantic icons and must not leak into the primitive/pattern layers.
- Next.js `layout.tsx` is a routing boundary; `*Shell` owns visual chrome.
- Web route groups are `(public)`, `(auth)` and `(app)`.
- Use focused subpath imports for `@shurokkha/ui` and `@shurokkha/ui-patterns`.
- Keep route `page.tsx` files thin; put reusable app composition in `src/components`.

## Validation

Run `pnpm verify` before considering repository-wide work complete. For focused changes, run the affected workspace checks plus `pnpm check:architecture` during iteration.
