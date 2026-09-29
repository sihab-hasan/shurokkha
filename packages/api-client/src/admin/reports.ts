import type {
  ActiveRescueTeamAssignmentResource,
  AreaSeverityBreakdownResource,
  CitizenRequestStatsResource,
  FacilityLocationsResource,
  FullOuterJoinResource,
  InnerJoinResource,
  LeftJoinResource,
  ReportSummaryResource,
  RightJoinResource,
  ShelterSummaryViewResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminReports = (client: ApiClient) => ({
  summary: () => client.get<ReportSummaryResource>("/v1/admin/reports/summary"),
  areaSeverity: () =>
    client.get<AreaSeverityBreakdownResource>(
      "/v1/admin/reports/area-severity"
    ),
  activeTeams: () =>
    client.get<ActiveRescueTeamAssignmentResource>(
      "/v1/admin/reports/active-teams"
    ),
  citizenStats: () =>
    client.get<CitizenRequestStatsResource>("/v1/admin/reports/citizen-stats"),
  shelterSummaryView: () =>
    client.get<ShelterSummaryViewResource>(
      "/v1/admin/reports/shelter-summary-view"
    ),

  innerJoin: () =>
    client.get<InnerJoinResource>("/v1/admin/reports/inner-join"),
  leftJoin: () => client.get<LeftJoinResource>("/v1/admin/reports/left-join"),
  rightJoin: () =>
    client.get<RightJoinResource>("/v1/admin/reports/right-join"),
  fullOuterJoin: () =>
    client.get<FullOuterJoinResource>("/v1/admin/reports/full-outer-join"),
  facilityLocations: () =>
    client.get<FacilityLocationsResource>(
      "/v1/admin/reports/facility-locations"
    ),
})
