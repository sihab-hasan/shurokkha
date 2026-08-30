# Agent Workspace

This directory contains concise repository-local context for coding agents. It supplements `AGENTS.md` and durable documentation in `docs/`; source code and configuration remain the source of truth.

## Read order

1. `project-overview.md`
2. `decisions.md`
3. `commands.md`
4. `design-guide.md`
5. `workflow-notes.md`
6. `todo.md`

## Repository snapshot

- Applications: `apps/web`, `apps/docs`, `apps/admin`.
- Shared packages: `api-client`, `auth`, `contracts`, `icons`, `permissions`, `ui`, `ui-patterns`, `utils`, `validation`.
- Tooling packages: ESLint, Prettier and TypeScript configuration.
- The standardized Laravel backend service is located under `services/api/`. Production deployment integration does not exist yet.

Keep these files short. When durable architecture changes, update `docs/` first and then adjust agent context only where it changes how an agent should work.
