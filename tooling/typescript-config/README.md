# `@shurokkha/typescript-config`

Shared TypeScript compiler presets for the monorepo.

## Exports

- `@shurokkha/typescript-config/base.json`
- `@shurokkha/typescript-config/nextjs.json`
- `@shurokkha/typescript-config/node.json`
- `@shurokkha/typescript-config/react-library.json`

## Usage

```json
{
  "extends": "@shurokkha/typescript-config/nextjs.json"
}
```

Workspace-specific `tsconfig.json` files should extend the appropriate preset and add only local include paths or overrides.
