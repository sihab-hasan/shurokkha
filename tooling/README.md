# Tooling

`tooling` contains the repository's reusable lint, formatting, and TypeScript configuration packages.

## Packages

- [`@shurokkha/eslint-config`](eslint-config/README.md) — ESLint presets for base, Node.js, Next.js, and internal React projects.
- [`@shurokkha/prettier-config`](prettier-config/README.md) — Shared Prettier rules and Tailwind CSS class sorting.
- [`@shurokkha/typescript-config`](typescript-config/README.md) — TypeScript presets for base, Node.js, Next.js, and React-library projects.

All tooling packages are private workspace dependencies. Update them carefully because a shared tooling change can affect every application and package in the monorepo.
