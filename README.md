# Shurokkha

Shurokkha is a disaster-relief and resource-coordination platform built as a pnpm/Turborepo monorepo. The repository currently contains the public Web experience, authenticated role workspaces, an Admin application, a Docs application, and reusable UI/application packages.

> **Status:** active product development. Frontend architecture and public core pages are implemented; backend services, persistent data, production authentication, and hosting integrations are not yet part of this repository.

## Workspaces

| Workspace              | Purpose                                                                      | Local URL                     |
| ---------------------- | ---------------------------------------------------------------------------- | ----------------------------- |
| `apps/web`             | Public site, authentication flows, citizen/donor/volunteer product areas     | `http://localhost:3000`       |
| `apps/docs`            | Product and design-system documentation                                      | `http://localhost:3001/docs`  |
| `apps/admin`           | Internal administration and operations workspace                             | `http://localhost:3003/admin` |
| `packages/ui`          | Domain-agnostic UI primitives, theme, providers, hooks and utilities         | Internal                      |
| `packages/ui-patterns` | Reusable application-level layouts, shells and interaction patterns          | Internal                      |
| `packages/icons`       | Shurokkha-semantic icon aliases                                              | Internal                      |
| `packages/*`           | Contracts, auth helpers, permissions, validation, API boundary and utilities | Internal                      |

## Toolchain

- Node.js **24 LTS recommended**; Next.js 16 requires Node.js 20.9 or newer
- pnpm 10.18.2
- Turborepo 2
- Next.js 16 / React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn-style shared UI backed by Base UI primitives

The repository includes `.node-version` and `.nvmrc` with the recommended Node major.

## Quick start

```bash
git clone git@github.com:sihab-hasan/Shurokkha.git
cd Shurokkha
pnpm setup
pnpm dev
```

Run an individual application:

```bash
pnpm --filter @shurokkha/web dev
pnpm --filter @shurokkha/docs dev
pnpm --filter @shurokkha/admin dev
```

## Validation

Before pushing or opening a pull request, run the full verification command:

```bash
pnpm verify
```

It runs architecture guards, Prettier verification, ESLint, TypeScript checks, and production builds.

Useful focused commands:

| Command                   | Purpose                                             |
| ------------------------- | --------------------------------------------------- |
| `pnpm check:architecture` | Validate repository, shell and Web UI boundaries    |
| `pnpm format:check`       | Verify formatting without changing files            |
| `pnpm lint`               | Run ESLint across workspaces                        |
| `pnpm typecheck`          | Run TypeScript checks                               |
| `pnpm build`              | Build all buildable workspaces                      |
| `pnpm clean`              | Remove generated build/dependency directories       |
| `pnpm stop`               | Stop local app servers on ports 3000, 3001 and 3003 |

## Repository architecture

```text
apps/                 deployable user-facing applications
packages/             stable reusable product/library boundaries
tooling/              shared lint/format/TypeScript configuration
services/             reserved for real backend runtime services
docs/                 durable technical/product documentation
.agents/               concise repository context for coding agents
.github/               CI, security, ownership and collaboration automation
```

UI dependency direction:

```text
app-specific UI
      ↓
@shurokkha/ui-patterns
      ↓
@shurokkha/ui
```

`@shurokkha/icons` is a sibling semantic package and must not be imported by the primitive `ui` or generic `ui-patterns` layers.

## Documentation

- [Documentation index](docs/README.md)
- [Architecture](docs/architecture.md)
- [Repository organization](docs/repository-organization.md)
- [Shell architecture](docs/shell-architecture.md)
- [Web page composition](docs/web-page-composition.md)
- [Engineering conventions](docs/conventions.md)
- [Design system](docs/design-system.md)
- [UI patterns guide](docs/ui-patterns-guide.md)
- [Design guide](docs/design-guide.md)
- [GitHub repository setup](docs/github-repository.md)
- [Roadmap](docs/roadmap.md)
- [Contributing](CONTRIBUTING.md)

## GitHub automation

The repository includes:

- CI for architecture, formatting, linting, typechecking and builds;
- conventional pull-request title validation;
- CodeQL JavaScript/TypeScript scanning via GitHub Default setup;
- Dependabot dependency and GitHub Actions updates;
- structured issue and pull-request templates;
- CODEOWNERS and a security policy.

After the first push, complete the repository settings checklist in [docs/github-repository.md](docs/github-repository.md).

## Current boundaries

- No deployable backend exists yet.
- No database/cache/email provider is connected.
- Auth screens and shared auth helpers exist, but no production identity provider is integrated.
- No deployment workflow is committed until real hosting targets and secrets are selected.

## License

All rights reserved. This repository is visible for approved collaboration but is **not open source**. See [LICENSE](LICENSE).
