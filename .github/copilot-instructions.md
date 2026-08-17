# Shurokkha Copilot instructions

Read `AGENTS.md` and `.agents/README.md` before making repository-wide changes.

Key boundaries:

- `apps/*` owns application routes, orchestration, domain UI, and branded shells.
- `packages/ui` owns domain-agnostic primitives, theme infrastructure, providers, and generic UI helpers.
- `packages/ui-patterns` owns stable reusable application-level compositions.
- `packages/icons` owns Shurokkha-semantic icons; do not move product semantics into `packages/ui`.
- Import `@shurokkha/ui` and `@shurokkha/ui-patterns` through focused subpath exports, not root barrels.
- Next.js `layout.tsx` files are routing boundaries; `*Shell` components own visual chrome.
- Web route groups are `(public)`, `(auth)`, and `(app)`. Do not recreate `(dashboard)` or `/auth` route folders.
- Do not invent backend services, environment variables, deployment providers, or API contracts that are not present in the repository.

Before review, run `pnpm verify`. For focused work, at minimum run the affected workspace's lint/typecheck plus `pnpm check:architecture`.
