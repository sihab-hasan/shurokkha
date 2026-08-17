# Workflow Notes

## Before editing

- Inspect the nearest source, package exports and relevant docs before proposing a new abstraction.
- Search for an existing primitive/pattern before adding one.
- Treat future roadmap language as non-implemented unless source confirms it.

## While editing

- Keep dependency direction intact.
- Avoid broad rename/refactor work unrelated to the requested change.
- Do not add fake APIs, mock production secrets, provider IDs or deployment logic.
- Keep docs synchronized when commands, paths or ownership rules change.
- Do not modify generated output or lockfile entries manually unless a dependency change requires it.

## Before completion

For repository-wide work run:

```bash
pnpm verify
```

For focused iteration, run the affected package/app checks plus `pnpm check:architecture`. If a full command cannot run because dependencies or external services are unavailable, report that explicitly and run the strongest local/static checks available.
