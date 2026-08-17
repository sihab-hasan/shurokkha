# `@shurokkha/prettier-config`

Shared Prettier configuration for the Shurokkha monorepo.

It centralizes the repository formatting rules and Tailwind CSS class sorting.
The Tailwind v4 stylesheet is resolved from `packages/ui/src/styles/globals.css`.

## Usage

The repository root consumes this package through the `prettier` field in the
root `package.json`, so apps and packages inherit it automatically.

```json
{
  "prettier": "@shurokkha/prettier-config"
}
```

Run formatting from the repository root:

```bash
pnpm format
```
