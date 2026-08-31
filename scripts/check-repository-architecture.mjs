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

// App aliases point directly at src; never use @/src/... imports.
for (const app of ["web", "admin"]) {
  expectContains(
    `apps/${app}/tsconfig.json`,
    '"@/*": [',
    `${app} must define the @/* source alias.`
  )
  expectContains(
    `apps/${app}/tsconfig.json`,
    '"./src/*"',
    `${app} @/* alias must resolve to ./src/*.`
  )
  for (const file of walkFiles(`apps/${app}/src`)) {
    if (!/\.(ts|tsx|mts)$/.test(file)) continue
    if (read(file).includes("@/src/"))
      failures.push(`${file} uses legacy @/src/... imports.`)
  }
}

// Shared UI infrastructure is owned once by @shurokkha/ui.
expectExists(
  "packages/ui/src/providers/ui-provider.tsx",
  "@shurokkha/ui must own UiProvider."
)
expectExists(
  "packages/ui/src/components/theme-switcher.tsx",
  "@shurokkha/ui must own ThemeSwitcher."
)
for (const app of ["web", "admin"]) {
  expectMissing(
    `apps/${app}/src/providers/app-providers.tsx`,
    `${app} must not duplicate shared UI providers.`
  )
  expectMissing(
    `apps/${app}/src/lib/utils.ts`,
    `${app} must use @shurokkha/ui/lib/utils instead of duplicating cn.`
  )
  expectMissing(
    `apps/${app}/src/hooks/use-mobile.ts`,
    `${app} must use @shurokkha/ui/hooks/use-mobile instead of duplicating the hook.`
  )
}
expectMissing(
  "apps/web/src/components/theme/theme-switcher.tsx",
  "Web must consume the shared ThemeSwitcher."
)
expectMissing(
  "apps/admin/src/components/theme/theme-switcher.tsx",
  "Admin must consume the shared ThemeSwitcher."
)

// Domain-semantic icons do not belong to the primitive UI package.
expectExists(
  "packages/icons/package.json",
  "Semantic icons must live in @shurokkha/icons."
)
expectMissing(
  "packages/ui/src/icons",
  "@shurokkha/ui must remain domain-agnostic; move semantic icons to @shurokkha/icons."
)

// Focused package entrypoints avoid mixed server/client root barrels.
for (const pkg of ["ui", "ui-patterns"]) {
  const packageJson = JSON.parse(read(`packages/${pkg}/package.json`))
  if (packageJson.exports?.["."])
    failures.push(
      `@shurokkha/${pkg} must use focused subpath exports, not a root barrel.`
    )
}
for (const base of ["apps", "packages"]) {
  for (const file of walkFiles(base)) {
    if (!/\.(ts|tsx|mts)$/.test(file)) continue
    const source = read(file)
    if (/from\s+["']@shurokkha\/ui["']/.test(source))
      failures.push(`${file} imports the @shurokkha/ui root barrel.`)
    if (/from\s+["']@shurokkha\/ui-patterns["']/.test(source))
      failures.push(`${file} imports the @shurokkha/ui-patterns root barrel.`)
  }
}

// No placeholder source folders or gitkeep markers in active app/package source trees.
for (const base of ["apps", "packages"]) {
  for (const file of walkFiles(base)) {
    if (file.endsWith("/.gitkeep"))
      failures.push(
        `${file} is an unnecessary placeholder; create folders only when they own real code.`
      )
  }
}

// PageContainer was removed: shells own semantic main elements.
expectMissing(
  "packages/ui-patterns/src/layout/page-container.tsx",
  "Removed PageContainer must not be reintroduced; use shell + ContentContainer."
)

// Dependency direction between shared visual layers.
for (const file of walkFiles("packages/ui/src")) {
  if (!/\.(ts|tsx|mts)$/.test(file)) continue
  const source = read(file)
  if (
    source.includes("@shurokkha/ui-patterns") ||
    source.includes("@shurokkha/icons")
  ) {
    failures.push(`${file} violates the primitive UI dependency boundary.`)
  }
}
for (const file of walkFiles("packages/ui-patterns/src")) {
  if (!/\.(ts|tsx|mts)$/.test(file)) continue
  const source = read(file)
  if (source.includes("@shurokkha/icons"))
    failures.push(
      `${file} makes ui-patterns product-domain aware through @shurokkha/icons.`
    )
  if (source.includes("apps/"))
    failures.push(`${file} must not depend on application source.`)
}

// Large route implementations belong in named app-owned components.
expectContains(
  "apps/admin/src/app/(app)/page.tsx",
  "AdminOverview",
  "Admin root page must stay a thin route boundary."
)
expectContains(
  "apps/admin/src/app/(app)/[...section]/page.tsx",
  "AdminSectionPage",
  "Admin catch-all route must delegate to an app component."
)
// App package manifests should not duplicate implementation dependencies owned by @shurokkha/ui.
const uiImplementationDeps = new Set([
  "@base-ui/react",
  "class-variance-authority",
  "cmdk",
  "input-otp",
  "react-day-picker",
  "react-resizable-panels",
  "recharts",
  "shadcn",
  "sonner",
  "tailwind-merge",
  "tw-animate-css",
])
for (const app of ["web", "admin"]) {
  const packageJson = JSON.parse(read(`apps/${app}/package.json`))
  for (const dependency of Object.keys(packageJson.dependencies ?? {})) {
    if (uiImplementationDeps.has(dependency))
      failures.push(
        `apps/${app} directly depends on ${dependency}; @shurokkha/ui owns that implementation dependency.`
      )
  }
}

// Pattern CSS is a package responsibility and must be loaded by every pattern-consuming app.
for (const app of ["web", "admin"]) {
  expectContains(
    `apps/${app}/src/styles/app.css`,
    "@shurokkha/ui-patterns/ui-patterns.css",
    `${app} must load shared ui-patterns CSS from src/styles/app.css.`
  )
}

if (failures.length) {
  console.error("Repository architecture check failed:\n")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log("Repository architecture check passed.")
