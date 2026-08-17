export type Permission = string

export function hasPermission(
  permissions: readonly Permission[],
  requiredPermission: Permission
) {
  return permissions.includes(requiredPermission)
}

export function hasAnyPermission(
  permissions: readonly Permission[],
  requiredPermissions: readonly Permission[]
) {
  return requiredPermissions.some((permission) =>
    permissions.includes(permission)
  )
}
