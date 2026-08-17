import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import globals from "globals"
import tseslint from "typescript-eslint"
import { config as baseConfig } from "./base.js"

/**
 * A shared ESLint configuration for Node.js TypeScript apps.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nodeJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },
]
