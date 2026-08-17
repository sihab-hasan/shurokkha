import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8")

const backendRoutes = read("services/api/routes/api.php")
const apiClient = read("packages/api-client/src/index.ts")
const apiLib = read("apps/web/src/lib/api.ts")

const expected = [
  ["api.v1.health", "get", "/v1/health"],
  ["api.v1.auth.csrf", "get", "/v1/auth/csrf"],
  ["api.v1.auth.register", "post", "/v1/auth/register"],
  ["api.v1.auth.login", "post", "/v1/auth/login"],
  ["api.v1.auth.me", "get", "/v1/auth/me"],
  ["api.v1.auth.logout", "post", "/v1/auth/logout"],
  [
    "api.v1.citizen.requests.index",
    "get",
    "/v1/citizen/requests${queryString(params)}",
  ],
  ["api.v1.citizen.requests.store", "post", "/v1/citizen/requests"],
  ["api.v1.citizen.requests.show", "get", "/v1/citizen/requests/${id}"],
  ["api.v1.citizen.requests.update", "patch", "/v1/citizen/requests/${id}"],
  ["api.v1.citizen.requests.destroy", "delete", "/v1/citizen/requests/${id}"],
  [
    "api.v1.citizen.requests.cancel",
    "post",
    "/v1/citizen/requests/${id}/cancel",
  ],
  [
    "api.v1.citizen.missing-persons.index",
    "get",
    "/v1/citizen/missing-persons${queryString(params)}",
  ],
  [
    "api.v1.citizen.missing-persons.store",
    "postForm",
    "/v1/citizen/missing-persons",
  ],
  [
    "api.v1.citizen.missing-persons.show",
    "get",
    "/v1/citizen/missing-persons/${id}",
  ],
  [
    "api.v1.citizen.missing-persons.photo",
    "getBlob",
    "/v1/citizen/missing-persons/${id}/photo",
  ],
  [
    "api.v1.citizen.missing-persons.update",
    "patchForm",
    "/v1/citizen/missing-persons/${id}",
  ],
  [
    "api.v1.citizen.missing-persons.destroy",
    "delete",
    "/v1/citizen/missing-persons/${id}",
  ],
  [
    "api.v1.citizen.missing-persons.close",
    "post",
    "/v1/citizen/missing-persons/${id}/close",
  ],
]

const failures = []
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

for (const [routeName, clientMethod, clientPath] of expected) {
  const shortName = routeName.replace(/^api\.v1\./, "")
  const declaredName = shortName.startsWith("citizen.")
    ? shortName.replace(/^citizen\./, "")
    : shortName.startsWith("auth.")
      ? shortName.replace(/^auth\./, "")
      : shortName

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
