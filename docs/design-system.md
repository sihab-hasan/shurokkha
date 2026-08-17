# Shurokkha Design System

This is the canonical visual and interaction contract for Shurokkha. It applies
across the public website, authenticated workspaces, Admin, Docs, and future
first-party web applications.

The existing Shurokkha light/dark color theme is **frozen**. Design-system work
may add semantic aliases and component tokens, but must not silently replace the
existing `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`,
`destructive`, card, popover, chart, sidebar, or radius values.

## Principles

1. **Calm under pressure.** Important actions should be obvious without making
   every surface visually urgent.
2. **Information before decoration.** Hierarchy comes from typography, spacing,
   grouping, and semantic state—not oversized radii or heavy shadows.
3. **One interaction language.** Buttons, fields, menus, tabs, dialogs, and
   navigation use the same focus, radius, and sizing logic across apps.
4. **Semantic over literal color.** Product code uses `success`, `warning`,
   `info`, and `danger`, not `emerald-*`, `amber-*`, `blue-*`, or `red-*`.
5. **Accessible by construction.** Shared primitives own keyboard, focus, and
   interactive-state behavior; final screens still require contextual testing.
6. **Density follows context.** Public pages are spacious; operational workspaces
   are denser. The component language does not change between them.

## Package ownership

```text
apps/*
  domain content, routes, data, product-specific composition
      ↓
@shurokkha/ui-patterns
  repeatable product structures and page archetypes
      ↓
@shurokkha/ui
  tokens, primitives, providers, accessibility behavior
```

Do not put `DisasterCard`, `ShelterCard`, donor policy, volunteer rules, API
entities, or route knowledge in `@shurokkha/ui`.

## Color and semantic state

The original theme remains the source of truth. Additive semantic tokens are:

| Token     | Meaning                                              |
| --------- | ---------------------------------------------------- |
| `primary` | Main product action and brand emphasis               |
| `success` | Verified, completed, available, healthy              |
| `warning` | Attention required, degraded, stale, caution         |
| `info`    | Informational or system context                      |
| `danger`  | Immediate risk, destructive action, critical failure |
| `muted`   | Secondary context and quiet grouping                 |

`danger` aliases the existing destructive intent. `info` aliases the existing
primary family. `success` and `warning` are additive state colors only; they do
not replace the core theme.

### Surface hierarchy

Use semantic surfaces instead of raw neutral colors:

```text
Page/background       bg-background
Standard card         bg-card
Quiet grouping        bg-muted/30 … bg-muted/50
Popover/overlay       bg-popover
Elevated alias        bg-surface-elevated
```

Do not invent page-local palettes.

## Radius

The existing `--radius: 0.625rem` (10px) remains unchanged.

| Purpose                                | Radius                   |
| -------------------------------------- | ------------------------ |
| Checkbox / tiny element                | 4–6px                    |
| Button / input / select / tab          | 8px (`rounded-md`)       |
| Alert / menu / item                    | 10px (`rounded-lg`)      |
| Card / dialog / large surface          | 12px (`rounded-xl`)      |
| Large CTA or exceptional media surface | 16px max (`rounded-2xl`) |
| Avatar / status dot / true pill        | `rounded-full`           |

Do not use `rounded-3xl` or `rounded-4xl` as the default component language.
A badge can be pill-shaped when the object is genuinely a compact status/tag;
buttons and navigation items should not become pills by default.

## Control sizing

The default interactive control is 40px high.

| Size    | Height | Use                                    |
| ------- | ------ | -------------------------------------- |
| `xs`    | 32px   | Dense secondary utilities only         |
| `sm`    | 36px   | Compact toolbars / tables              |
| default | 40px   | Standard forms and actions             |
| `lg`    | 44px   | Prominent CTA / mobile-friendly action |

Icon-only buttons use the corresponding square size. Important touch actions
should prefer 40–44px even though WCAG 2.2's minimum target-size criterion is
24×24 CSS pixels.

## Spacing

Use a 4px detail grid with an 8px-oriented layout rhythm.

```text
4   micro separation
8   related inline items
12  compact component internals
16  standard component spacing
20  dense card padding
24  standard card/form padding
32  component-group separation
40  large group separation
48  compact page-region separation
64  standard public section spacing
80  generous public section spacing
96  exceptional hero spacing
```

### Public sections

Public pages normally use:

```text
mobile  48px vertical
small   64px vertical
desktop 80px vertical
```

Hero regions may use 64 / 80 / 96px when the content genuinely needs it.
Do not add horizontal rules or full-width `border-t`, `border-b`, or `border-y`
just to separate public sections. Use whitespace, typography, cards, and subtle
surface changes instead.

### Workspace sections

Authenticated and administrative screens normally use 24–32px between major
content groups and 16–24px inside cards/forms.

## Containers

Canonical horizontal gutter:

```text
mobile   16px
small    24px
desktop  32px
```

Canonical widths:

| Name                | Width               | Use                                    |
| ------------------- | ------------------- | -------------------------------------- |
| `wide`              | 96rem               | Data-heavy/canvas-like screens only    |
| `default`           | 88rem               | Public shell, normal pages, dashboards |
| `narrow`            | 64rem (`max-w-5xl`) | Profile/editorial composition          |
| `reading` / `prose` | 48rem               | Long-form reading                      |
| `form`              | 42rem (`max-w-2xl`) | Focused forms                          |

Header, main public content, and footer must use the same default outer grid.

## Typography

Shurokkha uses the configured sans family for body/interface text and the
configured heading family for hierarchy. Keep typography restrained:

| Purpose                 | Typical size |
| ----------------------- | ------------ |
| Caption / metadata      | 12px         |
| UI label / compact body | 14px         |
| Standard body           | 16px         |
| Card title              | 16–20px      |
| Application page title  | 24–30px      |
| Public section title    | 24–36px      |
| Public hero title       | 36–48px      |

Long-form body text should normally use `leading-7` at 16px. Do not use display
sizes inside operational dashboards.

## Borders and elevation

Cards use a subtle border and `shadow-xs` by default. Heavy shadows are reserved
for overlays.

```text
Card           border + shadow-xs
Interactive    border + hover surface; optional shadow-card
Menu/popover   border + shadow-overlay
Dialog/sheet   border/ring + shadow-overlay
Page section   no divider line on public surfaces
```

Avoid stacking border + dark ring + large shadow on ordinary cards.

## Focus and interaction

Interactive primitives use a clearly visible 2px focus ring. Keep keyboard
focus visible; never remove focus indication without a replacement. Use
`aria-current` for active navigation and accessible names for icon-only actions.

Menus, dialogs, selects, tabs, and other composite widgets should preserve the
focus management and keyboard behavior provided by their Base UI/Radix-style
primitives rather than reimplementing it in app code.

## Motion

Motion is functional and short:

```text
fast  120ms
base  180ms
slow  240ms
```

Use motion for state transitions, overlays, and feedback—not decoration.
`prefers-reduced-motion` is respected globally.

## Page archetypes

### Public

```text
PublicShell
  header / utility navigation
  main
    ContentContainer(default)
      hero or PageHeader
      semantic sections
  neutral footer
```

Public pages are spacious and editorial. Do not use the authenticated workspace
shell or dense dashboard patterns for public marketing/information pages.

### Authenticated app

```text
AppShell → WorkspaceShell
  PageHeader
  dashboard / collection / entity / form / report / messaging pattern
```

`WorkspaceShell` already owns the content container. App pages must not add a
second `ContentContainer`.

### Admin

Use the same primitives and patterns as the main app with denser information,
more tables, and clearer operational status. Do not create a separate visual
brand for Admin.

### Docs

Docs is neutral and reference-oriented. It may use separators inside structured
reference surfaces, but still follows the same primitive sizes and token system.

## Forms

- Default fields: 40px controls, 8px radius.
- Labels: 14px medium weight.
- Help/error text: 12–14px.
- Use one column on mobile; two columns only when fields are logically parallel.
- Use `danger` for validation and destructive messaging.
- Never use placeholder text as the only label.
- Auth forms use the same field geometry as the rest of Shurokkha; auth density
  comes from layout and width, not pill-shaped controls.

## Status and emergency content

Do not make all disaster content red. Use:

- `info` for context,
- `warning` for caution/degraded state,
- `danger` for true critical risk,
- `success` for confirmed/complete/available state.

Emergency banners should state the action and boundary clearly. Critical color
is a semantic signal, not a general brand surface.

## Research basis

The system intentionally borrows principles rather than visual appearance from
established, accessibility-focused systems:

- Tailwind CSS theme variables: https://tailwindcss.com/docs/theme
- shadcn/ui theming: https://ui.shadcn.com/docs/theming
- W3C WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- WCAG target size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- GOV.UK spacing: https://design-system.service.gov.uk/styles/spacing/
- GOV.UK type scale: https://design-system.service.gov.uk/styles/type-scale/
- U.S. Web Design System spacing: https://designsystem.digital.gov/design-tokens/spacing-units/
- Radix accessibility principles: https://www.radix-ui.com/primitives/docs/overview/accessibility
- Carbon spacing: https://carbondesignsystem.com/elements/spacing/overview/

These are reference inputs, not dependencies and not visual themes to copy.
