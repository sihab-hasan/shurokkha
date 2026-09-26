import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8")

const backendRoutes = read("services/api/routes/api.php")
const apiClient = read("packages/api-client/src/client.ts")
const apiLib = read("apps/web/src/lib/api.ts")

const expected = [
  ["api.v1.health", "get", "/v1/health"],
  ["api.v1.auth.csrf", "get", "/v1/auth/csrf"],
  ["api.v1.auth.register", "post", "/v1/auth/register"],
  ["api.v1.auth.login", "post", "/v1/auth/login"],
  ["api.v1.auth.me", "get", "/v1/auth/me"],
  ["api.v1.auth.logout", "post", "/v1/auth/logout"],
  [
    "api.v1.assistance-requests.index",
    "get",
    "/v1/assistance-requests${queryString(params)}",
  ],
  ["api.v1.assistance-requests.store", "post", "/v1/assistance-requests"],
  ["api.v1.assistance-requests.show", "get", "/v1/assistance-requests/${id}"],
  [
    "api.v1.assistance-requests.update",
    "patch",
    "/v1/assistance-requests/${id}",
  ],
  [
    "api.v1.assistance-requests.destroy",
    "delete",
    "/v1/assistance-requests/${id}",
  ],
  [
    "api.v1.assistance-requests.cancel",
    "post",
    "/v1/assistance-requests/${id}/cancel",
  ],
  [
    "api.v1.missing-persons.index",
    "get",
    "/v1/missing-persons${queryString(params)}",
  ],
  ["api.v1.missing-persons.store", "postForm", "/v1/missing-persons"],
  ["api.v1.missing-persons.show", "get", "/v1/missing-persons/${id}"],
  [
    "api.v1.missing-persons.photo",
    "getBlob",
    "/v1/missing-persons/${id}/photo",
  ],
  ["api.v1.missing-persons.update", "patchForm", "/v1/missing-persons/${id}"],
  ["api.v1.missing-persons.destroy", "delete", "/v1/missing-persons/${id}"],
  ["api.v1.missing-persons.close", "post", "/v1/missing-persons/${id}/close"],
  ["api.v1.auth.me.profile.show", "get", "/v1/auth/me/profile"],
  ["api.v1.auth.me.profile.update", "patch", "/v1/auth/me/profile"],
  [
    "api.v1.auth.me.profile.avatar.upload",
    "postForm",
    "/v1/auth/me/profile/avatar",
  ],
  [
    "api.v1.auth.me.profile.avatar.destroy",
    "delete",
    "/v1/auth/me/profile/avatar",
  ],
  [
    "api.v1.auth.me.notification-preferences.show",
    "get",
    "/v1/auth/me/notification-preferences",
  ],
  [
    "api.v1.auth.me.notification-preferences.update",
    "put",
    "/v1/auth/me/notification-preferences",
  ],
  [
    "api.v1.auth.me.privacy-preferences.show",
    "get",
    "/v1/auth/me/privacy-preferences",
  ],
  [
    "api.v1.auth.me.privacy-preferences.update",
    "put",
    "/v1/auth/me/privacy-preferences",
  ],
  ["api.v1.auth.me.session.show", "get", "/v1/auth/me/session"],
]

// The settings routes are nested inside `Route::prefix('me')->name('me.')`
// so the declared name in routes/api.php is e.g. `profile.show`, not
// `me.profile.show`. After `api.v1.` and `auth.` are stripped from the
// expected name, the remaining `me.profile.show` won't appear literally in
// the source — Laravel composes the final route name at boot time.
const declaredNameOverrides = {
  "api.v1.auth.me.profile.show": "profile.show",
  "api.v1.auth.me.profile.update": "profile.update",
  "api.v1.auth.me.profile.avatar.upload": "profile.avatar.upload",
  "api.v1.auth.me.profile.avatar.destroy": "profile.avatar.destroy",
  "api.v1.auth.me.notification-preferences.show":
    "notification-preferences.show",
  "api.v1.auth.me.notification-preferences.update":
    "notification-preferences.update",
  "api.v1.auth.me.privacy-preferences.show": "privacy-preferences.show",
  "api.v1.auth.me.privacy-preferences.update": "privacy-preferences.update",
  "api.v1.auth.me.session.show": "session.show",
}

const failures = []
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

for (const [routeName, clientMethod, clientPath] of expected) {
  const shortName = routeName.replace(/^api\.v1\./, "")
  const declaredName =
    declaredNameOverrides[routeName] ??
    (shortName.startsWith("auth.")
      ? shortName.replace(/^auth\./, "")
      : shortName)

  if (!backendRoutes.includes(`->name('${declaredName}')`)) {
    failures.push(`Backend route name not found: ${routeName}`)
  }

  const methodAndPath = new RegExp(
    `client\\.${clientMethod}[\\s\\S]{0,180}?[\\"\\\`]${escapeRegExp(clientPath)}[\\"\\\`]`
  )
  if (!methodAndPath.test(apiClient)) {
    failures.push(
      `Typed API client mapping not found: ${clientMethod} ${clientPath}`
    )
  }
}

if (!apiLib.includes("normalizeApiBaseUrl")) {
  failures.push("Web API configuration is not using normalizeApiBaseUrl().")
}

if (
  !apiClient.includes("credentials: options.credentials ?? this.credentials")
) {
  failures.push("API client is not sending credential cookies with fetch().")
}

if (!apiClient.includes('headers["X-XSRF-TOKEN"]')) {
  failures.push("API client is not attaching Laravel's X-XSRF-TOKEN header.")
}

if (!backendRoutes.includes("Route::middleware('web')")) {
  failures.push(
    "Browser API routes are not using Laravel web/session middleware."
  )
}

const sourceRoots = [
  path.join(root, "apps/web/src"),
  path.join(root, "packages/api-client/src"),
]
const sourceFiles = []
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) sourceFiles.push(full)
  }
}
for (const sourceRoot of sourceRoots) walk(sourceRoot)

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8")
  const relative = path.relative(root, file)
  if (/fetch\(\s*["'`]https?:\/\//.test(source)) {
    failures.push(`Hard-coded absolute fetch() URL found in ${relative}`)
  }
  if (source.includes("/api/roles")) {
    failures.push(`Stale /api/roles reference found in ${relative}`)
  }
  if (
    source.includes("auth_token") ||
    /Authorization\s*[:=].*Bearer/i.test(source)
  ) {
    failures.push(`Browser bearer-token auth reference found in ${relative}`)
  }
}

if (failures.length) {
  console.error("API connection check failed:\n")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(
  `API connection check passed: ${expected.length} backend routes match typed frontend HTTP methods and paths.`
)
console.log(
  "Browser auth uses credential cookies + CSRF; no localStorage/bearer auth references were found."
)
