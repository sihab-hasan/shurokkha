# Architectural Decisions

These are active repository decisions, not roadmap proposals.

1. **Monorepo:** pnpm workspaces + Turborepo.
2. **Applications:** Web, Docs and Admin are the only deployable frontend workspaces currently present.
3. **UI dependency direction:** application composition → `ui-patterns` → `ui`.
4. **Product semantics:** `ui` and `ui-patterns` remain domain-agnostic; semantic icons live in `@shurokkha/icons` and product UI stays in apps.
5. **Focused exports:** `@shurokkha/ui` and `@shurokkha/ui-patterns` expose subpath APIs rather than root barrels.
6. **Next.js ownership:** `layout.tsx` selects an experience; `*Shell` owns visual chrome.
7. **Web groups:** `(public)`, `(auth)` and `(app)` are canonical. Do not recreate `(dashboard)` or an `/auth` URL folder.
8. **Pages:** route `page.tsx` files should be thin; reusable product composition belongs in app `src/components`.
9. **Backend:** do not add a service/package until a real runtime owner and requirements exist.
10. **Deployment:** no deployment workflow until hosting targets, environments, secrets and rollback behavior are real.
11. **License:** repository remains All Rights Reserved / not open source.
