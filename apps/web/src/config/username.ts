export const DEMO_USERNAME = "sihab.xd"

export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "auth",
  "help",
  "moderator",
  "official",
  "shurokkha",
  "shurokkha",
  "security",
  "staff",
  "support",
  "system",
])

const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9._]{1,28}[a-z0-9])?$/

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

export function isAllowedUsername(username: string) {
  const normalizedUsername = normalizeUsername(username)

  return (
    USERNAME_PATTERN.test(normalizedUsername) &&
    !RESERVED_USERNAMES.has(normalizedUsername)
  )
}
