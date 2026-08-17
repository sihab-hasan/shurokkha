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

// Shared patterns required by the Web architecture.
expectExists(
  "packages/ui-patterns/src/auth/auth-header.tsx",
  "ui-patterns auth surface must provide AuthHeader."
)
expectExists(
  "packages/ui-patterns/src/auth/auth-state.tsx",
  "ui-patterns auth surface must provide AuthState."
)
expectContains(
  "packages/ui-patterns/src/auth/index.ts",
  "./auth-header",
  "Auth barrel must export AuthHeader."
)
expectContains(
  "packages/ui-patterns/src/auth/index.ts",
  "./auth-state",
  "Auth barrel must export AuthState."
)

// Public pages are scaffold-only by default. A small reviewed set is intentionally
// implemented as complete public experiences with route-private _components.
expectMissing(
  "apps/web/src/components/public",
  "Cross-route public feature UI should not be reintroduced; keep full-page public UI route-private unless reuse is proven."
)
const fullPublicPagePaths = new Set([
  "apps/web/src/app/(public)/about/page.tsx",
  "apps/web/src/app/(public)/about/how-it-works/page.tsx",
  "apps/web/src/app/(public)/contact/page.tsx",
  "apps/web/src/app/(public)/u/[username]/page.tsx",
])
const fullPublicComponentPrefixes = [
  "apps/web/src/app/(public)/about/_components/",
  "apps/web/src/app/(public)/about/how-it-works/_components/",
  "apps/web/src/app/(public)/contact/_components/",
  "apps/web/src/app/(public)/u/[username]/_components/",
]
const isFullPublicPage = (filePath) => fullPublicPagePaths.has(filePath)
const isFullPublicComponent = (filePath) =>
  fullPublicComponentPrefixes.some((prefix) => filePath.startsWith(prefix))

// Public visual language uses spacing and tonal surfaces instead of horizontal section dividers.
for (const base of [
  "apps/web/src/app/(public)",
  "apps/web/src/components/shells/public",
]) {
  for (const filePath of walkFiles(base)) {
    if (!/\.(ts|tsx)$/.test(filePath)) continue
    const source = read(filePath)
    if (/\bborder-(?:t|b|y)(?:-|\b)/.test(source))
      failures.push(
        `${filePath} uses a horizontal divider utility; public sections must separate with spacing/surfaces instead.`
      )
    if (
      /from\s+["']@shurokkha\/ui\/components\/separator["']/.test(source) ||
      /<Separator\b/.test(source)
    ) {
      failures.push(
        `${filePath} uses Separator; public page/shell composition must avoid divider-style section separation.`
      )
    }
  }
}

for (const filePath of walkFiles("apps/web/src/app/(public)")) {
  const fullPage = isFullPublicPage(filePath)
  if (filePath.includes("/_components/") && !isFullPublicComponent(filePath)) {
    failures.push(
      `${filePath} should not exist for scaffold-only public routes.`
    )
  }
  if (!filePath.endsWith("/page.tsx")) continue
  const source = read(filePath)
  if (source.includes("PageContainer"))
    failures.push(`${filePath} must not use removed PageContainer.`)
  if (fullPage) continue

  if (!source.includes("ContentContainer"))
    failures.push(
      `${filePath} must use ContentContainer; SiteShell owns only <main>.`
    )
  if (!source.includes("PageHeader"))
    failures.push(`${filePath} must use PageHeader.`)
  if (/<h[12]\b/.test(source))
    failures.push(
      `${filePath} must use shared heading patterns instead of raw h1/h2 markup.`
    )
  const capitalizedTags = [...source.matchAll(/<([A-Z][A-Za-z0-9.]*)\b/g)].map(
    (match) => match[1]
  )
  const allowed = new Set(["ContentContainer", "PageHeader", "SectionHeader"])
  for (const tag of capitalizedTags) {
    if (!allowed.has(tag))
      failures.push(
        `${filePath} contains public implementation component <${tag}>; only heading scaffold patterns are allowed.`
      )
  }
}

// WorkspaceShell already owns ContentContainer and the semantic main region.
for (const filePath of walkFiles("apps/web/src/app/(app)")) {
  if (!filePath.endsWith("/page.tsx")) continue
  const source = read(filePath)
  if (source.includes("ContentContainer"))
    failures.push(`${filePath} duplicates WorkspaceShell content gutters.`)
  if (source.includes("PageContainer"))
    failures.push(
      `${filePath} must not use removed PageContainer or add another semantic <main>.`
    )
  if (/<h[12]\b/.test(source))
    failures.push(
      `${filePath} should compose page archetypes instead of raw page headings.`
    )
}

// AuthShell owns auth width, main semantics, and alignment.
for (const filePath of walkFiles("apps/web/src/app/(auth)")) {
  if (!filePath.endsWith("/page.tsx")) continue
  const source = read(filePath)
  for (const forbidden of [
    "ContentContainer",
    "PageContainer",
    "PageHeader",
    "SectionHeader",
  ]) {
    if (source.includes(forbidden))
      failures.push(
        `${filePath} must use auth-specific composition, not ${forbidden}.`
      )
  }
  if (/<h[12]\b/.test(source))
    failures.push(
      `${filePath} must use AuthHeader/AuthState instead of raw headings.`
    )
}

// Web-owned cross-route compositions must delegate stable UI structure to ui-patterns.
expectContains(
  "apps/web/src/components/app/app-collection-page.tsx",
  "CollectionView",
  "AppCollectionPage should use collection patterns."
)
expectContains(
  "apps/web/src/components/app/app-collection-page.tsx",
  "PageHeader",
  "AppCollectionPage should use PageHeader."
)
expectContains(
  "apps/web/src/components/app/app-resource-detail.tsx",
  "EntityHeader",
  "AppResourceDetail should use entity patterns."
)
expectContains(
  "apps/web/src/components/app/app-profile.tsx",
  "EntityMetadata",
  "AppProfile should use entity patterns."
)
expectContains(
  "apps/web/src/components/app/app-messages.tsx",
  "ConversationLayout",
  "AppMessages should use messaging patterns."
)
expectContains(
  "apps/web/src/components/app/app-notifications.tsx",
  "NotificationList",
  "AppNotifications should use notification patterns."
)
expectContains(
  "apps/web/src/components/auth/auth-state-view.tsx",
  "AuthState",
  "Web auth state wrapper must compose shared AuthState."
)
expectMissing(
  "apps/web/src/components/auth/auth-page-header.tsx",
  "Web must use shared AuthHeader instead of a duplicate header."
)
expectMissing(
  "apps/web/src/components/auth/auth-status.tsx",
  "Web must use AuthStateView + shared AuthState instead of legacy AuthStatus."
)
expectMissing(
  "apps/web/src/components/app/app-section.tsx",
  "Use the page-archetype name AppCollectionPage, not AppSection."
)

if (failures.length) {
  console.error("Web UI architecture check failed:\n")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log("Web UI architecture check passed.")
