# @shurokkha/ui-patterns

Reusable, application-level UI composition patterns for Shurokkha.

`@shurokkha/ui-patterns` sits **above** `@shurokkha/ui`: the UI package owns the design-system primitives, while this package composes those primitives into repeatable application experiences such as list reports, master-detail screens, entity/object pages, forms, approvals, dashboards, activity feeds, search, selectors, reporting, and feedback states.

## Architecture

```text
apps/*
  └─ domain workflows, routing, permissions, data fetching, mutations
       ↓
@shurokkha/ui-patterns
  └─ application-level composition and interaction patterns
       ↓
@shurokkha/ui
  └─ shadcn/Base UI primitives, tokens, utilities and styling
```

### Package boundaries

- Keep business/domain logic in the apps, not in this package.
- Keep low-level primitives in `@shurokkha/ui`.
- Keep patterns controlled or controllable so apps own data and mutation state.
- Accept actions, icons, renderable content, and callbacks rather than importing app-specific dependencies.
- Treat UI visibility as presentation only; authorization must still be enforced by the application/server.
- Prefer semantic HTML and the accessibility behavior already supplied by `@shurokkha/ui` primitives.

## Design contract

Patterns follow the shared Shurokkha design system in `docs/design-system.md`: 40px default controls, restrained radii, semantic status tokens, predictable content gutters, and context-specific density. Reusable patterns must not introduce raw hue-based status colors or a competing theme.

## Pattern catalog

| Area          | Patterns                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Activity      | activity feed/item, comments, change history                                                                                                                       |
| Auth          | auth shell, auth header, and reusable authentication state/outcome composition                                                                                     |
| Collections   | list/grid collection shells, result footer and pagination/action slots                                                                                             |
| Attachments   | uploader, list, preview                                                                                                                                            |
| Dashboard     | dashboard grid, KPI card, metric card, metric strip, chart card, widget frame                                                                                      |
| Data          | data table, loading/empty states, toolbar, pagination, column visibility, selection hooks                                                                          |
| Entity        | entity header, summary, metadata, status, actions, tabs                                                                                                            |
| Feedback      | empty, error, access denied, confirmation, loading, status banners, data freshness/live state                                                                      |
| Filters       | filter bar, active filters, filter sheet, saved views, state hooks                                                                                                 |
| Forms         | form grid, field group, sections, sticky actions, validation summary, dirty-state guard                                                                            |
| Layout        | workspace shell/header/sidebar, site shell, content container, content section, sidebar layout, master-detail, resizable split view, explorer/map workspace layout |
| Messaging     | conversation workspace, conversation list shell, message thread shell                                                                                              |
| Navigation    | page header/actions/tabs, section navigation                                                                                                                       |
| Notifications | notification list and notification item                                                                                                                            |
| Overlays      | action dialog, detail drawer, quick view                                                                                                                           |
| Progress      | reusable process/step sequence for donation, help, onboarding and operational flows                                                                                |
| Reporting     | report header, filters, viewer, export actions                                                                                                                     |
| Search        | global search field, search dialog, search results                                                                                                                 |
| Selectors     | entity picker, multi-entity picker, hierarchical picker                                                                                                            |
| Workflow      | workflow status, approval actions, approval route, workflow timeline                                                                                               |

## Shurokkha-specific design coverage

The package intentionally supports the recurring structures already present in the Shurokkha web experience without moving domain components into the shared layer:

- dashboard/application chrome -> `WorkspaceShell`
- operations/disaster/shelter map workspaces -> `ExplorerLayout`
- disaster, shelter, resource, campaign and search result surfaces -> collection patterns
- emergency/critical/preparedness callouts -> `StatusBanner`
- live, stale, updating and offline response data -> `DataFreshness`
- donation, assistance, volunteer and onboarding flows -> `ProcessSteps`
- shared sign-in/verification layout across web/admin -> `AuthShell`, `AuthHeader`, `AuthState`
- role dashboards with future messaging -> messaging shells
- account/operational updates -> notification patterns

Domain cards and workflows such as `DisasterCard`, `ShelterCard`, `DonationCard`, API calls, route handling, permissions and mutation logic stay in the consuming application.

## Future-proofing rules

New patterns should be added only when at least one of these is true:

1. the same composition is repeated across multiple routes or apps;
2. the composition owns meaningful accessibility/responsive interaction behavior;
3. the composition is a stable product primitive likely to survive domain/data-model changes.

Do **not** add a pattern merely because a screen has a visually unique card. Prefer slots and controlled props over router, API, authentication, map-provider or data-fetching dependencies. This keeps `ui-patterns` reusable by `apps/web`, `apps/admin`, and future clients.

## Imports

Import a focused surface when possible:

```tsx
import { DataTable, DataTableToolbar } from "@shurokkha/ui-patterns/data-table"
import { useDataTable, useSelection } from "@shurokkha/ui-patterns/hooks"
import { PageHeader } from "@shurokkha/ui-patterns/navigation"
import { WorkspaceShell, ExplorerLayout } from "@shurokkha/ui-patterns/layout"
import { CollectionView } from "@shurokkha/ui-patterns/collections"
import { EntityStatus } from "@shurokkha/ui-patterns/entity"
```

The root export is also available for cases where a single entry point is preferable:

```tsx
import { ContentContainer } from "@shurokkha/ui-patterns/layout"
import { FormActions, FormSection } from "@shurokkha/ui-patterns/forms"
```

## Canonical page composition

Shurokkha uses different page composition rules for each route experience. Do not force one wrapper onto every screen.

```text
(public)
PublicShell -> SiteShell (<main>) -> page.tsx -> ContentContainer -> PageHeader + <section>/SectionHeader

(app)
Role layout -> AppShell -> WorkspaceShell (<main> + ContentContainer) -> page.tsx -> page archetype pattern

(auth)
AuthLayout -> app AuthShell -> pattern AuthShell (<main> + auth width) -> page.tsx -> AuthHeader/AuthState + form/content
```

### Public pages

Public pages own their content width because `SiteShell` intentionally owns only document flow and `<main>`. Use `ContentContainer`, `PageHeader`, semantic `<section>`, and `SectionHeader`. Domain section implementations remain route-private `_components` when they are introduced.

### Signed-in app pages

`WorkspaceShell` already applies `ContentContainer`, so app pages must **not** wrap themselves in `ContentContainer`. Start with the page archetype instead:

- overview -> `PageHeader` + dashboard patterns
- list -> `PageHeader` + collection/data-table/filter patterns
- detail -> entity patterns
- form -> `PageHeader` + form patterns
- report -> reporting patterns
- messaging -> messaging patterns
- notification center -> notification patterns
- map/canvas -> `ExplorerLayout` inside the owning shell

### Authentication pages

`AuthShell` owns `<main>`, responsive width, alignment, and optional story/brand slots. Auth pages do not use `ContentContainer`, or application `PageHeader`. Use `AuthHeader` for form/recovery screens and `AuthState` for signed-out, locked, pending, denied, or verification outcomes. Application routing/actions remain in the consuming app.

## React Server Component boundaries

Composition-only patterns remain server-safe where practical. Files that own DOM event handlers, interactive callbacks, React state/effects, dialogs, selectors, filtering/table controls, uploaders, or hooks declare an explicit `"use client"` boundary. This keeps server-rendered pages from accidentally importing event-handler implementations as Server Components while avoiding turning the entire package into a client bundle.

## Data-table philosophy

The table layer intentionally stays dependency-light. It provides reusable application behavior for:

- typed columns and cell renderers
- client-side search, sort, pagination, and column visibility hooks
- controlled row selection and bulk-action composition
- compact/comfortable density
- loading and empty states
- sticky headers and row actions

For server-side or highly specialized grids, keep the pattern shell and own the data engine in the consuming app. This avoids coupling every app to one grid implementation.

## Accessibility and interaction

Patterns are composed from the accessible primitives in `@shurokkha/ui`, but accessibility still has to be verified in the context of each final screen. In particular, test:

- keyboard-only navigation and visible focus
- accessible names for icon-only actions
- validation/error association with fields
- dialog/drawer focus behavior
- table headings and selection semantics
- zoom/reflow and responsive layouts
- loading, empty, error, permission, and destructive-action states

## Styling

Patterns use the same Tailwind/design tokens as `@shurokkha/ui`; they do not introduce a competing visual system. `src/styles/ui-patterns.css` is reserved for package-level pattern CSS when utility classes are not sufficient.

## Verification

From the workspace root:

```bash
pnpm --filter @shurokkha/ui typecheck
pnpm --filter @shurokkha/ui-patterns typecheck
pnpm --filter @shurokkha/ui-patterns lint
pnpm check:architecture
```

## Layout and shell management

Shells are infrastructure, not page components. Keep document concerns (HTML, fonts, providers, metadata) in each app root layout and mount experience-specific shells in route-group layouts.

```text
root layout (document + providers)
  ├─ public/site route group -> SiteShell
  ├─ authenticated workspace -> WorkspaceShell
  ├─ auth route group -> AuthShell
  └─ specialized canvas/map -> ExplorerLayout inside the owning shell
```

### Shell ownership rules

- `WorkspaceShell` owns viewport locking, the main scroll region, content width/gutters, skip navigation, and sidebar/header sizing tokens.
- `WorkspaceShellHeader` inherits the configured shell height; app headers own branding, search and actions only.
- `WorkspaceShellSidebar` derives its desktop top/height from `--workspace-shell-header-height`; never hard-code `top-14` or duplicate viewport calculations in apps.
- `SiteShell` owns public/documentation page flow and the main-content skip target while allowing sticky headers to remain direct layout children.
- `ContentContainer` is the non-semantic width/gutter primitive for headers, sections, and nested layouts. Experience shells own the semantic `<main>`.
- Route-level `loading.tsx` and `error.tsx` belong inside the route group so the surrounding shell remains stable during navigation and failures.

Apps should keep shell dimensions/configuration in one app-level config module. A change to header height, sidebar width, content density or max width should not require coordinated edits across header, sidebar and page components.
