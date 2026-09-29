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
    alerts: {
      list: "/operations/alerts",
      new: "/operations/alerts/new",
      detail: (id: number | string) => `/operations/alerts/${id}`,
    },
    news: {
      list: "/operations/news",
      new: "/operations/news/new",
      detail: (id: number | string) => `/operations/news/${id}`,
    },
    fundraises: {
      list: "/operations/fundraises",
      new: "/operations/fundraises/new",
      detail: (id: number | string) => `/operations/fundraises/${id}`,
    },
    guides: {
      list: "/operations/guides",
      new: "/operations/guides/new",
      detail: (id: number | string) => `/operations/guides/${id}`,
    },
    volunteers: {
      list: "/operations/volunteers",
      detail: (id: number | string) => `/operations/volunteers/${id}`,
    },
    shelters: {
      list: "/operations/shelters",
      new: "/operations/shelters/new",
      detail: (id: number | string) => `/operations/shelters/${id}`,
    },
    warehouses: {
      list: "/operations/warehouses",
      new: "/operations/warehouses/new",
      detail: (id: number | string) => `/operations/warehouses/${id}`,
    },
    donations: {
      list: "/operations/donations",
      new: "/operations/donations/new",
    },
  },
  reports: {
    list: "/reports",
    joins: "/reports/joins",
    tvup: "/reports/tvup",
  },
  users: {
    list: "/users",
    new: "/users/new",
    detail: (id: number | string) => `/users/${id}`,
  },
  loginAudits: {
    list: "/login-audits",
    detail: (id: number | string) => `/login-audits/${id}`,
  },
} as const

export type AdminRoutes = typeof adminRoutes
