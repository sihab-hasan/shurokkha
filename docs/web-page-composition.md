# Web Page Composition

The Web application has three route experiences. Each experience owns different layout responsibilities; pages must not repeat wrappers already owned by their shell.

## `(public)`

```text
PublicLayout
└─ PublicShell
   └─ SiteShell                 # owns semantic <main>
      └─ page.tsx
         └─ ContentContainer    # public page owns width/gutters
```

Canonical interior page composition:

```text
ContentContainer
├─ PageHeader
└─ <section>
   └─ SectionHeader
```

Most public routes intentionally remain lightweight heading scaffolds until their product/content design is implemented. The following public experiences currently contain full route-private page composition:

- `/about`
- `/about/how-it-works`
- `/contact`
- `/u/[username]` public profile

Their detailed components live in route `_components` because they are currently page-specific. Shared patterns still come from `@shurokkha/ui-patterns`.

Public visual rule: do not use horizontal divider lines between sections or shell regions. Prefer vertical rhythm, soft surface changes, cards, and grouped content.

## `(app)`

```text
CitizenLayout / DonorLayout / VolunteerLayout
└─ AppShell(role)
   └─ WorkspaceShell            # owns <main>, scroll region and ContentContainer
      └─ page.tsx
         └─ page archetype
```

Do **not** add another `ContentContainer` inside signed-in pages. Choose the closest pattern family:

- overview: `PageHeader` + dashboard patterns;
- collection/list: collection/data-table patterns;
- detail: entity patterns;
- forms: form patterns;
- report: reporting patterns;
- messages: messaging patterns;
- notifications: notification patterns;
- map/canvas: `ExplorerLayout`.

Cross-route product compositions belong in `apps/web/src/components/app`.

## `(auth)`

```text
AuthLayout
└─ Web AuthShell
   └─ @shurokkha/ui-patterns/AuthShell   # owns <main>, width and alignment
      └─ page.tsx
         ├─ AuthHeader + form
         └─ or AuthState / AuthStateView
```

Do not use `ContentContainer`, `PageHeader` or `SectionHeader` inside auth pages. Routing, links, forms and Shurokkha branding remain Web-owned; the shared pattern layer owns stable auth presentation primitives.

## Naming contract

- `layout.tsx`: Next.js route/layout boundary.
- `PublicShell`: Web public-site chrome.
- `AuthShell`: Web authentication shell wrapper.
- `AppShell`: Web signed-in role shell.
- `WorkspaceShell`: generic reusable sidebar workspace primitive.
- `ContentContainer`: non-semantic width/gutter wrapper.

`PageContainer` is intentionally absent because semantic `<main>` ownership belongs to shells.
