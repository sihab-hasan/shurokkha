# Engineering Conventions

## Workspace boundaries

- Keep routes, domain behavior and branded composition inside the owning `apps/*` workspace.
- Move code into `packages/*` only when it has a stable reusable responsibility.
- Consume other workspaces only through package exports; never use cross-workspace relative imports.
- Keep internal packages private and use `workspace:*` for internal dependencies.
- Do not create placeholder packages or services before they have a real owner and consumer.

## UI boundaries

- `@shurokkha/ui`: domain-agnostic primitives, theme infrastructure, providers, generic hooks and UI utilities.
- `@shurokkha/ui-patterns`: stable reusable application-level layouts and interaction patterns.
- `@shurokkha/icons`: product-semantic icon aliases.
- Application `src/components`: reusable compositions that still know Shurokkha/product context.
- Route `_components`: route-private composition only when the UI is not reused elsewhere.

Use focused exports:

```ts
import { Button } from "@shurokkha/ui/components/button"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
```

Do not add root barrels for `ui` or `ui-patterns`.

## Next.js naming

- `layout.tsx` is a routing boundary.
- `*Shell` owns visual application chrome and top-level geometry.
- Web route groups are `(public)`, `(auth)` and `(app)`.
- Prefer kebab-case user-facing routes such as `/sign-in`.
- Keep `page.tsx` files thin and declarative.

## TypeScript and validation

- Export explicit types at package boundaries.
- Use `@shurokkha/contracts` for stable cross-workspace TypeScript contracts.
- Use `@shurokkha/validation` for shared runtime schemas.
- Keep app-local types near their feature instead of growing catch-all packages.
- Do not weaken compiler/lint rules to hide a local issue.

## Environment and secrets

- Never commit populated `.env` files, credentials, certificates or private keys.
- Commit only sanitized `.env.example` / `.env.*.example` files when a real environment variable exists.
- Do not document speculative environment variables before the integration exists.

## Commands

Run from the repository root:

```bash
pnpm setup
pnpm dev
pnpm check:architecture
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm verify
```

Target a workspace by package name when iterating:

```bash
pnpm --filter @shurokkha/web dev
pnpm --filter @shurokkha/ui lint
pnpm --filter @shurokkha/ui-patterns typecheck
```

## Git and pull requests

- Branch from `main` and keep changes focused.
- Use conventional pull-request titles accepted by `.github/workflows/pr-title.yml`.
- Include screenshots for visible UI changes.
- Update architecture/docs when moving responsibilities or changing commands.
- Run `pnpm verify` before requesting review.
- Never commit generated output or sensitive data.
