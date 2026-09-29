export const operationsQueryKeys = {
  all: ["admin", "operations"] as const,
  affectedAreas: {
    all: () => ["admin", "operations", "affected-areas"] as const,
    list: () => [...operationsQueryKeys.affectedAreas.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.affectedAreas.all(), "detail", id] as const,
  },
  rescueTeams: {
    all: () => ["admin", "operations", "rescue-teams"] as const,
    list: () => [...operationsQueryKeys.rescueTeams.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.rescueTeams.all(), "detail", id] as const,
  },
  assignments: {
    all: () => ["admin", "operations", "assignments"] as const,
    list: () => [...operationsQueryKeys.assignments.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.assignments.all(), "detail", id] as const,
  },
  disasters: {
    all: () => ["admin", "operations", "disasters"] as const,
    list: () => [...operationsQueryKeys.disasters.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.disasters.all(), "detail", id] as const,
  },
  emergencyRequests: {
    all: () => ["admin", "operations", "emergency-requests"] as const,
    list: () =>
      [...operationsQueryKeys.emergencyRequests.all(), "list"] as const,
  },
  alerts: {
    all: () => ["admin", "operations", "alerts"] as const,
    list: () => [...operationsQueryKeys.alerts.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.alerts.all(), "detail", id] as const,
  },
  news: {
    all: () => ["admin", "operations", "news"] as const,
    list: () => [...operationsQueryKeys.news.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.news.all(), "detail", id] as const,
  },
  fundraises: {
    all: () => ["admin", "operations", "fundraises"] as const,
    list: () => [...operationsQueryKeys.fundraises.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.fundraises.all(), "detail", id] as const,
  },
  guides: {
    all: () => ["admin", "operations", "guides"] as const,
    list: () => [...operationsQueryKeys.guides.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.guides.all(), "detail", id] as const,
  },
  volunteers: {
    all: () => ["admin", "operations", "volunteers"] as const,
    list: () => [...operationsQueryKeys.volunteers.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.volunteers.all(), "detail", id] as const,
  },
  shelters: {
    all: () => ["admin", "operations", "shelters"] as const,
    list: () => [...operationsQueryKeys.shelters.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.shelters.all(), "detail", id] as const,
  },
  warehouses: {
    all: () => ["admin", "operations", "warehouses"] as const,
    list: () => [...operationsQueryKeys.warehouses.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.warehouses.all(), "detail", id] as const,
  },
  donations: {
    all: () => ["admin", "operations", "donations"] as const,
    list: () => [...operationsQueryKeys.donations.all(), "list"] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.donations.all(), "detail", id] as const,
  },
  users: {
    all: () => ["admin", "users"] as const,
    list: (params?: Record<string, unknown>) =>
      [...operationsQueryKeys.users.all(), "list", params] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.users.all(), "detail", id] as const,
  },
  loginAudits: {
    all: () => ["admin", "login-audits"] as const,
    list: (params?: Record<string, unknown>) =>
      [...operationsQueryKeys.loginAudits.all(), "list", params] as const,
    detail: (id: number | string) =>
      [...operationsQueryKeys.loginAudits.all(), "detail", id] as const,
  },
  reports: {
    all: () => ["admin", "reports"] as const,
    summary: () => [...operationsQueryKeys.reports.all(), "summary"] as const,
    areaSeverity: () =>
      [...operationsQueryKeys.reports.all(), "area-severity"] as const,
    activeTeams: () =>
      [...operationsQueryKeys.reports.all(), "active-teams"] as const,
    citizenStats: () =>
      [...operationsQueryKeys.reports.all(), "citizen-stats"] as const,
    shelterSummaryView: () =>
      [...operationsQueryKeys.reports.all(), "shelter-summary-view"] as const,
    innerJoin: () =>
      [...operationsQueryKeys.reports.all(), "inner-join"] as const,
    leftJoin: () =>
      [...operationsQueryKeys.reports.all(), "left-join"] as const,
    rightJoin: () =>
      [...operationsQueryKeys.reports.all(), "right-join"] as const,
    fullOuterJoin: () =>
      [...operationsQueryKeys.reports.all(), "full-outer-join"] as const,
    facilityLocations: () =>
      [...operationsQueryKeys.reports.all(), "facility-locations"] as const,
  },
} as const
