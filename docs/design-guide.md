# Design Guide

The canonical Shurokkha design guidance is split into two focused documents:

- [Design system](./design-system.md) — theme boundaries, semantic tokens,
  radius, sizing, spacing, typography, elevation, focus, motion, containers,
  accessibility, and page archetypes.
- [UI patterns guide](./ui-patterns-guide.md) — pattern ownership, extraction
  rules, density, status semantics, and reusable page composition.

## Non-negotiable defaults

```text
Base radius       10px (existing --radius remains unchanged)
Control radius     8px
Card radius       12px
Default control   40px
Large control     44px
Mobile gutter     16px
Tablet gutter     24px
Desktop gutter    32px
Public section    48 / 64 / 80px responsive rhythm
App section       24–32px
Default container 88rem
```

The existing Shurokkha light/dark color theme is not replaced by the design
system. Only semantic aliases and state tokens may be added.
