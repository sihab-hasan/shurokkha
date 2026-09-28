/**
 * Admin route paths.
 *
 * Keep these as the single source of truth for internal navigation so that
 * deep-linking, breadcrumbs, and `<Link href>` calls stay in sync. All
 * operations routes are namespaced under `/operations`.
 */
export const adminRoutes = {
  dashboard: "/",
  operations: {
    root: "/operations",
    affectedAreas: {
      list: "/operations/affected-areas",
      new: "/operations/affected-areas/new",
      detail: (id: number | string) => `/operations/affected-areas/${id}`,
    },
    rescueTeams: {
      list: "/operations/rescue-teams",
      new: "/operations/rescue-teams/new",
      detail: (id: number | string) => `/operations/rescue-teams/${id}`,
    },
    teamManagement: {
      list: "/operations/team-management",
      new: "/operations/team-management/new",
      detail: (id: number | string) => `/operations/team-management/${id}`,
    },
  },
} as const

export type AdminRoutes = typeof adminRoutes
