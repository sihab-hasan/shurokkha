# `@shurokkha/eslint-config`

Shared ESLint flat-config presets for the monorepo.

## Exports

- `@shurokkha/eslint-config/base`
- `@shurokkha/eslint-config/node`
- `@shurokkha/eslint-config/next-js`
- `@shurokkha/eslint-config/react-internal`

## Usage

```js
import { nextJsConfig } from "@shurokkha/eslint-config/next-js"

export default nextJsConfig
```

Applications and packages should consume the closest matching preset instead of copying shared rules into local config files.
