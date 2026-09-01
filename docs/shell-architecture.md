# Layout and shell architecture

Shurokkha uses a strict distinction between **Next.js layouts** and **visual shells**.

- `layout.tsx` is a routing boundary. It selects an experience and should stay thin.
- `*Shell` is visual application chrome. It owns header/sidebar/footer composition, viewport behavior and top-level content flow.
- shared shell mechanics live in `@shurokkha/ui-patterns`; branded/domain-aware shell composition lives inside each app.

## Web experience naming

```text
apps/web/src/app/
├── layout.tsx                 # RootLayout: html/body/fonts/providers only
├── (public)/
│   └── layout.tsx             # PublicLayout -> PublicShell
├── (auth)/
│   └── layout.tsx             # AuthLayout -> AuthShell
└── (app)/
    ├── citizen/layout.tsx     # CitizenLayout -> AppShell(role="citizen")
    ├── donor/layout.tsx       # DonorLayout -> AppShell(role="donor")
    └── volunteer/layout.tsx   # VolunteerLayout -> AppShell(role="volunteer")
```

`(app)` is preferred over `(dashboard)` because the signed-in product contains messages, forms, settings, detail pages and workflows in addition to overview dashboards.

## Shell component ownership

```text
apps/web/src/components/shells/
├── public/
│   ├── public-shell.tsx
│   ├── public-header.tsx
│   ├── public-navbar.tsx
│   ├── public-topbar.tsx
│   ├── public-sidebar.tsx
│   └── public-footer.tsx
├── auth/
│   └── auth-shell.tsx
└── app/
    ├── app-shell.tsx
    ├── app-header.tsx
    ├── app-sidebar.tsx
    └── nav-types.ts
```

The app-specific names intentionally match their route-group experience: `PublicLayout -> PublicShell`, `AuthLayout -> AuthShell`, and signed-in role layouts -> `AppShell`.

## Shared shell primitives

```text
@shurokkha/ui-patterns/layout
├── WorkspaceShell
├── WorkspaceShellHeader
├── WorkspaceShellSidebar
├── SiteShell
├── ContentContainer
├── SidebarLayout
└── ExplorerLayout
```

`WorkspaceShell` is the neutral shared name for sidebar-based product chrome. Do not call the shared primitive `AppShell`: `AppShell` is reserved for a consuming application's branded signed-in shell.

`AuthShell` remains in `@shurokkha/ui-patterns/auth` as the reusable authentication composition; `apps/web` wraps it with its own `AuthShell` to add Shurokkha branding, story content and navigation.

## Admin

```text
apps/admin/src/app/
├── layout.tsx                 # RootLayout
└── (app)/layout.tsx           # AdminLayout -> AdminShell
```

Admin shell chrome is colocated under `src/components/shells/admin`.

## Config naming

Shell geometry and navigation are separate concerns:

```text
web/config/shell-config.ts          # app shell dimensions/behavior
web/config/app-navigation.tsx       # signed-in role navigation
web/config/public-site-config.ts    # public brand/nav/actions/announcements
admin/config/shell-config.ts
admin/config/admin-navigation.tsx
```

Do not put route navigation arrays inside `shell-config.ts`.

## Ownership rules

1. Root layouts own document setup, fonts, metadata, global CSS and providers only.
2. Route-group layouts choose shells; they do not reproduce shell JSX.
3. Shells own global chrome and top-level geometry.
4. Pages and `_components` never calculate sidebar offsets, viewport shell height or global gutters.
5. Cross-app geometry belongs in `ui-patterns`; app branding/navigation stays in the consuming app.
6. `WorkspaceShell` publishes `--workspace-shell-header-height`, `--sidebar-width`, and `--sidebar-width-icon`; headers and sidebars consume those tokens instead of repeating dimensions.
7. Route-private UI uses `_components`; reusable cross-route app UI uses `src/components`.

Run `pnpm check:shells` after changing shell geometry or route-group shell ownership. Run `pnpm check:web-ui` after changing Web page composition, and `pnpm check:architecture` to run both guards.

## Web page composition by route group

Shell ownership determines what `page.tsx` should render.

```text
(public)
PublicLayout -> PublicShell -> SiteShell (<main>)
page.tsx -> ContentContainer -> PageHeader -> <section> -> SectionHeader

(app)
Citizen/Donor/Volunteer Layout -> AppShell -> WorkspaceShell
WorkspaceShell owns <main>, scrolling, gutters and ContentContainer
page.tsx starts directly with PageHeader / Entity / Report / Messaging / other page pattern

(auth)
AuthLayout -> Web AuthShell -> @shurokkha/ui-patterns/AuthShell
AuthShell owns <main>, auth width and alignment
page.tsx starts with AuthHeader or AuthState and auth-domain content
```

Never add `ContentContainer` to `(app)` pages because `WorkspaceShell` already owns it. Never add `ContentContainer` or `PageHeader` to `(auth)` pages. `PageContainer` has been removed because semantic `<main>` ownership belongs to the experience shell.
