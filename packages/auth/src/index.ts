export function hasRole(userRoles: string[], requiredRole: string) {
  return userRoles.includes(requiredRole)
}
