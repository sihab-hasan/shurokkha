# Commands

Run commands from the repository root.

## Setup and development

```bash
pnpm setup
pnpm dev
pnpm stop
```

`pnpm setup` performs a frozen-lockfile install. `pnpm stop` targets the current app ports 3000 and 3003.

## Verification

```bash
pnpm verify
```

Equivalent core checks:

```bash
pnpm check:architecture
pnpm check:github
pnpm check:design
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

## Focused work

```bash
pnpm --filter @shurokkha/web dev
pnpm --filter @shurokkha/admin typecheck
pnpm --filter @shurokkha/ui lint
pnpm --filter @shurokkha/ui-patterns typecheck
```

## Cleanup

```bash
pnpm clean
```

This removes generated build/dependency directories. It does not modify source or the lockfile.
