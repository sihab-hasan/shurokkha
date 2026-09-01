# Application package usage

Shurokkha applications follow a three-layer UI architecture:

```text
apps/web | apps/admin
              ↓
      @shurokkha/ui-patterns
              ↓
          @shurokkha/ui
```

## Rules

- Applications own routes, domain models, business rules, data fetching, and entity-specific components.
- `@shurokkha/ui-patterns` owns reusable layout, workflow, collection, feedback, navigation, dashboard, form, messaging, and reporting structures.
- `@shurokkha/ui` owns low-level primitives and design-system building blocks.
- Domain components such as `DisasterCard`, `ShelterCard`, and campaign-specific business UI stay in the owning application.
- Add a new pattern only when a stable interaction or layout repeats across screens or applications.

## Current application foundations

- **Web:** `SiteShell` for public chrome, `WorkspaceShell` for signed-in roles, `AuthShell`/`AuthHeader`/`AuthState` for access flows, plus collection, entity, dashboard, reporting, messaging, notification, feedback, and progress patterns selected by page archetype.
- **Admin:** layout-level `WorkspaceShell`, shared navigation/dashboard/feedback/collection patterns, plus future route scaffolds.

## Future routes

Admin includes catch-all route scaffolds. A dedicated route file can replace a scaffold at any time without changing the shared shell or package architecture.
