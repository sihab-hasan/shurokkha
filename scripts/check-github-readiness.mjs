import { existsSync, readFileSync } from "node:fs"
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

for (const file of [
  ".github/workflows/ci.yml",
  ".github/workflows/pr-title.yml",
  ".github/CODEOWNERS",
  ".github/SECURITY.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/copilot-instructions.md",
  ".node-version",
  ".nvmrc",
  ".gitattributes",
  ".editorconfig",
  "AGENTS.md",
])
  expectExists(file, `Missing GitHub/push-readiness file: ${file}`)

expectMissing(
  ".github/workflows/deploy.yml",
  "Do not commit a placeholder deployment workflow before a real deployment exists."
)
expectNotContains(
  ".github/workflows/ci.yml",
  "api-tests",
  "CI must not contain a nonexistent API test job."
)
expectContains(
  ".github/workflows/ci.yml",
  "pnpm check:architecture",
  "CI must enforce architecture checks."
)
expectContains(
  ".github/workflows/ci.yml",
  "pnpm check:github",
  "CI must enforce GitHub readiness checks."
)
expectContains(
  ".github/workflows/ci.yml",
  "pnpm format:check",
  "CI must verify formatting."
)
expectMissing(
  ".github/workflows/codeql.yml",
  "CodeQL uses GitHub Default setup; do not commit an Advanced setup workflow."
)
expectNotContains(
  ".github/CODEOWNERS",
  "@shurokkha/",
  "CODEOWNERS must not reference placeholder organization teams."
)
expectContains(
  ".npmrc",
  "engine-strict=true",
  ".npmrc must contain a valid repository policy."
)
expectNotContains(
  ".npmrc",
  "\n24",
  ".npmrc must not contain the old invalid Node version placeholder."
)

const packageJson = JSON.parse(read("package.json"))
if (!packageJson.scripts?.verify?.includes("check:github"))
  failures.push("pnpm verify must include check:github.")
if (packageJson.scripts?.setup !== "pnpm install --frozen-lockfile")
  failures.push("pnpm setup must use a reproducible frozen-lockfile install.")

if (failures.length) {
  console.error("GitHub readiness check failed:\n")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log("GitHub readiness check passed.")
