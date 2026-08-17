# Contributing

Shurokkha is visible for approved collaboration but is not open source. Contributions are accepted only under terms agreed with the repository owner; the codebase remains `UNLICENSED` / All Rights Reserved.

## Before starting

- Search existing issues and the roadmap for overlapping work.
- Confirm large product, architecture, dependency, data-model, security, or infrastructure changes with the repository owner.
- Never commit credentials, populated environment files, private keys, personal data, or generated build output.
- Read [AGENTS.md](AGENTS.md) when using an AI coding agent.

## Local setup

Recommended:

- Node.js 24 LTS (minimum supported by the app stack: Node.js 20.9)
- pnpm 10.18.2
- Git

```bash
pnpm setup
pnpm verify
```

## Development workflow

1. Create a focused branch from `main`.
2. Keep one concern per pull request.
3. Keep app-specific domain code in its owning application.
4. Move code into `packages/*` only when it has a stable reusable responsibility.
5. Update docs/agent context when commands, routes, packages, shells or architecture boundaries change.
6. Run focused checks while developing and `pnpm verify` before requesting review.

Examples:

```bash
pnpm --filter @shurokkha/web dev
pnpm --filter @shurokkha/ui lint
pnpm --filter @shurokkha/ui-patterns typecheck
pnpm check:architecture
```

## Commit and pull-request discipline

Pull-request titles must use one of these conventional types:

`feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`.

Examples:

```text
feat: add public contact experience
refactor: align app shell ownership
ci: add repository architecture validation
```

Pull requests should include:

- the user/system impact;
- related issues or decisions;
- validation performed;
- screenshots/recordings for visible UI changes;
- risks, migrations or known limitations when relevant.

## Required verification

```bash
pnpm verify
```

CI runs the same core quality gates on pull requests targeting `main`.

## Security

Do not report vulnerabilities in public issues. Follow [.github/SECURITY.md](.github/SECURITY.md).

## Documentation ownership

- root `README.md`: repository entry point and setup;
- `docs/`: durable architecture, engineering and product documentation;
- nearest app/package `README.md`: workspace-specific APIs and usage;
- `.agents/`: concise operational context for coding agents;
- `.github/`: collaboration, security and automation configuration.
