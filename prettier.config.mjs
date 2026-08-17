import baseConfig from "./tooling/prettier-config/prettier.config.mjs"

export default {
  ...baseConfig,
  tailwindStylesheet: "./packages/ui/src/styles/globals.css",
}
