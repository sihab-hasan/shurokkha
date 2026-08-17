import { existsSync, readdirSync, rmSync, statSync } from "node:fs"
import { resolve } from "node:path"

const root = process.cwd()
const removableNames = new Set([
  "node_modules",
  ".next",
  ".turbo",
  "dist",
  "build",
  "out",
  "coverage",
  ".nyc_output",
])

let removed = 0

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (entry === ".git") continue

    const target = resolve(directory, entry)
    if (!existsSync(target) || !statSync(target).isDirectory()) continue

    if (removableNames.has(entry)) {
      rmSync(target, { recursive: true, force: true })
      console.log(`Removed ${target.replace(`${root}/`, "")}`)
      removed += 1
      continue
    }

    walk(target)
  }
}

walk(root)

for (const file of readdirSync(root)) {
  if (!file.endsWith(".tsbuildinfo")) continue
  rmSync(resolve(root, file), { force: true })
  removed += 1
}

console.log(
  removed ? `Cleaned ${removed} generated path(s).` : "Nothing to clean."
)
