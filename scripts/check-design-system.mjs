import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { resolve } from "node:path"

const root = process.cwd()
const failures = []
const absolute = (path) => resolve(root, path)
const read = (path) => readFileSync(absolute(path), "utf8")

function walkFiles(path) {
  if (!existsSync(absolute(path))) return []
  const out = []
  for (const entry of readdirSync(absolute(path))) {
    if (
      entry === "node_modules" ||
      entry === ".next" ||
      entry === "dist" ||
      entry === ".turbo"
    )
      continue
    const child = `${path}/${entry}`
    if (statSync(absolute(child)).isDirectory()) out.push(...walkFiles(child))
    else out.push(child)
  }
  return out
}

function expectExists(path, message) {
  if (!existsSync(absolute(path))) failures.push(message)
}

function expectMissing(path, message) {
  if (existsSync(absolute(path))) failures.push(message)
}

function expectContains(path, value, message) {
  if (!existsSync(absolute(path)) || !read(path).includes(value))
    failures.push(message)
}

const globalsPath = "packages/ui/src/styles/globals.css"
expectExists(globalsPath, "Shared UI stylesheet must exist.")

// Freeze the existing core theme values. Additive semantic aliases are allowed.
const frozenThemeValues = [
  "--primary: oklch(0.52 0.105 223.128);",
  "--background: oklch(1 0 0);",
  "--foreground: oklch(0.145 0 0);",
  "--card: oklch(1 0 0);",
  "--secondary: oklch(0.967 0.001 286.375);",
  "--muted: oklch(0.97 0 0);",
  "--accent: oklch(0.97 0 0);",
  "--destructive: oklch(0.577 0.245 27.325);",
  "--radius: 0.625rem;",
  "--background: oklch(0.145 0 0);",
  "--foreground: oklch(0.985 0 0);",
  "--primary: oklch(0.45 0.085 224.283);",
]
for (const value of frozenThemeValues) {
  expectContains(
    globalsPath,
    value,
    `Core theme value changed or is missing: ${value}`
  )
}

for (const token of ["success", "warning", "info", "danger"]) {
  expectContains(
    globalsPath,
    `--${token}:`,
    `Shared theme must expose --${token}.`
  )
  expectContains(
    globalsPath,
    `--color-${token}:`,
    `Tailwind theme must expose color utility for ${token}.`
  )
}

for (const app of ["web", "admin", "docs"]) {
  const appCss = `apps/${app}/src/styles/app.css`
  expectExists(
    appCss,
    `${app} must use src/styles/app.css as its application stylesheet.`
  )
  expectMissing(
    `apps/${app}/src/app/globals.css`,
    `${app} must not keep a duplicate app/globals.css entrypoint.`
  )
  expectContains(
    appCss,
    '@import "@shurokkha/ui/globals.css";',
    `${app} must load shared UI tokens.`
  )
  expectContains(
    appCss,
    '@import "@shurokkha/ui-patterns/ui-patterns.css";',
    `${app} must load shared pattern CSS.`
  )
}

// Shared product patterns communicate semantic state, never literal palette intent.
const literalStatusColor =
  /\b(?:bg|text|border|ring)-(?:emerald|green|lime|amber|yellow|blue|sky|cyan|red|rose)-\d{2,3}\b/
for (const file of walkFiles("packages/ui-patterns/src")) {
  if (!/\.(ts|tsx)$/.test(file)) continue
  if (literalStatusColor.test(read(file)))
    failures.push(
      `${file} uses a literal status color; use semantic state tokens.`
    )
}

// The system uses restrained geometry; very large radii are not the default language.
const oversizedRadius = /\brounded(?:-[tblrxy])?-(?:3xl|4xl)\b/
for (const base of ["packages/ui/src", "packages/ui-patterns/src", "apps"]) {
  for (const file of walkFiles(base)) {
    if (!/\.(ts|tsx)$/.test(file)) continue
    if (oversizedRadius.test(read(file)))
      failures.push(
        `${file} uses rounded-3xl/4xl; reserve large geometry for explicitly reviewed media surfaces.`
      )
  }
}

expectContains(
  "packages/ui/src/components/button.tsx",
  'default:\n          "h-(--control-height)',
  "Default buttons must stay 40px high."
)
expectContains(
  "packages/ui/src/components/input.tsx",
  '"h-(--control-height) w-full',
  "Default inputs must stay 40px high."
)
expectContains(
  "packages/ui/src/components/card.tsx",
  "rounded-xl",
  "Standard cards must use the shared 12px-equivalent radius tier."
)

// Public composition rules are deliberate product rules.
expectContains(
  "apps/web/src/components/shells/public/public-footer.tsx",
  "bg-muted/40",
  "Public footer should remain a neutral surface."
)
if (
  existsSync(
    absolute("apps/web/src/components/shells/public/public-footer.tsx")
  ) &&
  read("apps/web/src/components/shells/public/public-footer.tsx").includes(
    "bg-primary"
  )
) {
  failures.push(
    "Public footer must not use bg-primary as a section background."
  )
}
expectContains(
  "apps/web/src/components/shells/public/public-container.tsx",
  'size="default"',
  "Public header/footer must share the default content grid."
)

const publicConfig = "apps/web/src/config/public-site-config.ts"
if (existsSync(absolute(publicConfig))) {
  const source = read(publicConfig)
  const navBlock = source.match(/navItems:\s*\[(.*?)\]\s*,/s)?.[1] ?? ""
  if (navBlock.includes("How it works"))
    failures.push('Public header navigation must not contain "How it works".')
}

for (const requiredDoc of [
  "docs/design-system.md",
  "docs/design-guide.md",
  "docs/ui-patterns-guide.md",
])
  expectExists(
    requiredDoc,
    `Missing design-system documentation: ${requiredDoc}`
  )

if (failures.length) {
  console.error("Design-system check failed:\n")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log("Design-system check passed.")
