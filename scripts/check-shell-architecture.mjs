import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { resolve } from "node:path"

const root = process.cwd()
const failures = []
const absolute = (path) => resolve(root, path)
const read = (path) => readFileSync(absolute(path), "utf8")

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
function expectNotContains(path, value, message) {
  if (existsSync(absolute(path)) && read(path).includes(value))
    failures.push(message)
}
function walkFiles(path) {
  if (!existsSync(absolute(path))) return []
  const out = []
  for (const entry of readdirSync(absolute(path))) {
    const child = `${path}/${entry}`
    if (statSync(absolute(child)).isDirectory()) out.push(...walkFiles(child))
    else out.push(child)
  }
  return out
}

// Web route groups and clean user-facing auth routes.
for (const group of ["(public)", "(auth)", "(app)"]) {
  expectExists(`apps/web/src/app/${group}`, `Web must define ${group}.`)
}
expectMissing(
  "apps/web/src/app/(dashboard)",
  "Use (app), not (dashboard), for signed-in product routes."
)
expectMissing(
  "apps/web/src/app/auth",
  "Use the (auth) route group; do not add an /auth URL folder."
)
for (const route of ["sign-in", "sign-up", "sign-out"]) {
  expectExists(
    `apps/web/src/app/(auth)/${route}`,
    `Auth route ${route} must use kebab-case.`
  )
}

// Layout files are thin Next.js boundaries; app chrome belongs in src/components/shells.
expectContains(
  "apps/web/src/app/(public)/layout.tsx",
  "PublicShell",
  "(public)/layout.tsx must mount PublicShell."
)
expectContains(
  "apps/web/src/app/(auth)/layout.tsx",
  "AuthShell",
  "(auth)/layout.tsx must mount AuthShell."
)
expectNotContains(
  "apps/web/src/app/(public)/layout.tsx",
  "SiteShell",
  "Public layout must not compose package primitives directly; PublicShell owns chrome."
)
expectNotContains(
  "apps/web/src/app/(auth)/layout.tsx",
  "@shurokkha/ui-patterns",
  "Auth layout must delegate visual composition to the app AuthShell."
)

for (const file of [
  "apps/web/src/components/shells/public/public-shell.tsx",
  "apps/web/src/components/shells/auth/auth-shell.tsx",
  "apps/web/src/components/shells/app/app-shell.tsx",
  "apps/web/src/components/shells/app/app-header.tsx",
  "apps/web/src/components/shells/app/app-sidebar.tsx",
])
  expectExists(file, `Missing web shell file: ${file}`)

for (const role of ["citizen", "donor", "volunteer"]) {
  const path = `apps/web/src/app/(app)/${role}/layout.tsx`
  expectContains(path, "AppShell", `${role} layout must mount AppShell.`)
  expectContains(
    path,
    `role="${role}"`,
    `${role} layout must select its role explicitly.`
  )
}

// Admin is an application, so its signed-in route group is also named (app).
expectExists(
  "apps/admin/src/app/(app)/layout.tsx",
  "Admin must use an (app) route group."
)
expectMissing(
  "apps/admin/src/app/(workspace)",
  "Admin route group should be (app); workspace is the generic shell pattern, not a route-group name."
)
expectContains(
  "apps/admin/src/app/(app)/layout.tsx",
  "AdminShell",
  "Admin app layout must mount AdminShell."
)
expectNotContains(
  "apps/admin/src/app/layout.tsx",
  "AdminShell",
  "Admin root layout must contain document/providers only."
)
expectExists(
  "apps/admin/src/components/shells/admin/admin-shell.tsx",
  "AdminShell must live under components/shells/admin."
)

// Docs keeps a semantic (docs) experience boundary.
expectExists(
  "apps/docs/src/app/(docs)/layout.tsx",
  "Docs must use a (docs) route group."
)
expectContains(
  "apps/docs/src/app/(docs)/layout.tsx",
  "DocsShell",
  "Docs layout must mount DocsShell."
)
expectNotContains(
  "apps/docs/src/app/layout.tsx",
  "DocsShell",
  "Docs root layout must contain document/providers only."
)
expectExists(
  "apps/docs/src/components/shells/docs/docs-shell.tsx",
  "DocsShell must live under components/shells/docs."
)

// Shared pattern naming: WorkspaceShell is neutral; app-specific AppShell stays inside apps/web.
for (const file of [
  "workspace-shell.tsx",
  "workspace-shell-header.tsx",
  "workspace-shell-sidebar.tsx",
]) {
  expectExists(
    `packages/ui-patterns/src/layout/${file}`,
    `Missing shared workspace shell primitive: ${file}`
  )
}
for (const file of [
  "app-shell.tsx",
  "app-shell-header.tsx",
  "app-shell-sidebar.tsx",
]) {
  expectMissing(
    `packages/ui-patterns/src/layout/${file}`,
    `Shared layout package must use WorkspaceShell naming, not ${file}.`
  )
}
expectContains(
  "packages/ui-patterns/src/layout/index.ts",
  "./workspace-shell",
  "Layout barrel must export WorkspaceShell."
)
expectContains(
  "packages/ui-patterns/src/layout/workspace-shell.tsx",
  "--workspace-shell-header-height",
  "WorkspaceShell must publish its header-height token."
)
expectContains(
  "packages/ui-patterns/src/layout/workspace-shell-sidebar.tsx",
  "--workspace-shell-header-height",
  "WorkspaceShellSidebar must consume the shell header-height token."
)

// No legacy dashboard-as-shell naming or route-private _sections convention.
for (const legacy of [
  "apps/web/src/components/layout/dashboard",
  "apps/web/src/config/dashboard-navigation.tsx",
  "apps/web/src/config/layout-config.ts",
  "apps/web/src/config/nav-config.ts",
])
  expectMissing(legacy, `Legacy layout/shell path remains: ${legacy}`)

for (const directory of [
  "apps/web/src/app/(public)",
  "apps/web/src/app/(auth)",
  "apps/web/src/app/(app)",
]) {
  for (const filePath of walkFiles(directory)) {
    if (filePath.includes("/_sections/"))
      failures.push(
        `${filePath} uses _sections; route-private UI convention is _components.`
      )
  }
}

// Every Next app transpiles the shared source package.
for (const app of ["web", "admin", "docs"]) {
  expectContains(
    `apps/${app}/next.config.ts`,
    '"@shurokkha/ui-patterns"',
    `${app} must transpile @shurokkha/ui-patterns.`
  )
}

// Sidebar geometry is owned by shared workspace tokens.
for (const path of [
  "apps/web/src/components/shells/app/app-sidebar.tsx",
  "apps/admin/src/components/shells/admin/admin-sidebar.tsx",
]) {
  const source = read(path)
  if (/md:top-14|100svh-3\.5rem|calc\(100svh\s*-\s*3\.5rem\)/.test(source)) {
    failures.push(`${path} contains hard-coded workspace geometry.`)
  }
  if (!source.includes("WorkspaceShellSidebar"))
    failures.push(`${path} must use WorkspaceShellSidebar.`)
}

if (failures.length) {
  console.error("Shell architecture check failed:\n")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log("Shell architecture check passed.")
