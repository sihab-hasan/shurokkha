# Agent Design Guide

Use the durable [design guide](../docs/design-guide.md) and shared package code as the source of truth. This file records only the rules an agent should remember while editing.

## Visual intent

Shurokkha should feel calm, credible and operational. Emergency emphasis must communicate urgency without turning the entire interface destructive/red.

## Ownership

- Theme/tokens/primitives: `packages/ui`.
- Reusable screen/application patterns: `packages/ui-patterns`.
- Semantic product icons: `packages/icons`.
- Shurokkha-branded/domain composition: owning app.
- Public shell/navigation config: `apps/web/src/config/public-site-config.ts` and `apps/web/src/components/shells/public/`.
- Signed-in Web navigation: `apps/web/src/config/app-navigation.tsx`.

## Foundation defaults

- Do not change the established Shurokkha light/dark core theme values during ordinary UI work.
- Use semantic `success`, `warning`, `info`, and `danger` state tokens instead of literal palette utilities.
- Default controls are 40px; `sm` is 36px, `xs` is 32px, and prominent `lg` actions are 44px.
- Controls normally use `rounded-md`, menus/alerts `rounded-lg`, and cards/dialog surfaces `rounded-xl`.
- Public sections use roughly 48 / 64 / 80px responsive vertical spacing; workspaces are intentionally denser.
- App-level CSS entrypoints live at `apps/*/src/styles/app.css` and import the shared UI and pattern styles.

## Layout rules

- Never calculate global sidebar/header offsets in pages.
- Shells own `<main>` and top-level geometry.
- Public pages use `ContentContainer`; signed-in pages inherit it from `WorkspaceShell`; auth pages inherit width/alignment from `AuthShell`.
- Use `PageHeader` for page-level headings and `SectionHeader` for public section headings where appropriate.
- Do not reintroduce `PageContainer` or a generic `SectionContainer` duplicate.
- Public sections and public shell chrome must not use horizontal divider lines; separate areas with spacing and tonal surfaces instead.

## Component placement

- Route-private UI: route `_components` only when it is genuinely local.
- Cross-route product UI: app `src/components`.
- Cross-app stable pattern: `packages/ui-patterns`.
- Primitive/generic control: `packages/ui`.

## Accessibility

Preserve semantic landmarks, keyboard navigation, visible focus, label associations and non-color status cues. Prefer existing accessible primitives/patterns over custom interaction implementations.
