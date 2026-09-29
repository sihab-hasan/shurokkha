export const operationsQueryKeys = {
  all: ["admin", "operations"] as const,
  affectedAreas: {
    all: () => ["admin", "operations", "affected-areas"] as const,
    list: () => [...operationsQueryKeys.affectedAreas.all(), "list"] as const,
  },
  rescueTeams: {
    all: () => ["admin", "operations", "rescue-teams"] as const,
    list: () => [...operationsQueryKeys.rescueTeams.all(), "list"] as const,
  },
  assignments: {
    all: () => ["admin", "operations", "assignments"] as const,
    list: () => [...operationsQueryKeys.assignments.all(), "list"] as const,
  },
  disasters: {
    all: () => ["admin", "operations", "disasters"] as const,
    list: () => [...operationsQueryKeys.disasters.all(), "list"] as const,
  },
  emergencyRequests: {
    all: () => ["admin", "operations", "emergency-requests"] as const,
    list: () =>
      [...operationsQueryKeys.emergencyRequests.all(), "list"] as const,
  },
} as const
