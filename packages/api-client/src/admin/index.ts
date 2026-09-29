import type { ApiClient } from "../client"

import { adminAffectedAreas } from "./affected-areas"
import { adminAlerts } from "./alerts"
import { adminAppeals } from "./appeals"
import { adminAssignments } from "./assignments"
import { adminComplaints } from "./complaints"
import { adminDisasters } from "./disasters"
import { adminDocuments } from "./documents"
import { adminDonations } from "./donations"
import { adminEmergencyRequests } from "./emergency-requests"
import { adminFeedback } from "./feedback"
import { adminFundraises } from "./fundraises"
import { adminGuides } from "./guides"
import { adminHelpRequests } from "./help-requests"
import { adminLoginAudits } from "./login-audits"
import { adminNews } from "./news"
import { adminReports } from "./reports"
import { adminRescueTeams } from "./rescue-teams"
import { adminShelters } from "./shelters"
import { adminShelterResidencies } from "./shelter-residencies"
import { adminUsers } from "./users"
import { adminVolunteers } from "./volunteers"
import { adminWarehouses } from "./warehouses"

export * from "./emergency-requests"
export * from "./warehouses"

export const makeAdmin = (client: ApiClient) => ({
  admin: {
    disasters: adminDisasters(client),
    affectedAreas: adminAffectedAreas(client),
    rescueTeams: adminRescueTeams(client),
    assignments: adminAssignments(client),
    emergencyRequests: adminEmergencyRequests(client),
    shelters: adminShelters(client),
    warehouses: adminWarehouses(client),
    donations: adminDonations(client),
    alerts: adminAlerts(client),
    news: adminNews(client),
    fundraises: adminFundraises(client),
    guides: adminGuides(client),
    volunteers: adminVolunteers(client),
    complaints: adminComplaints(client),
    feedback: adminFeedback(client),
    helpRequests: adminHelpRequests(client),
    documents: adminDocuments(client),
    appeals: adminAppeals(client),
    shelterResidencies: adminShelterResidencies(client),
    users: adminUsers(client),
    loginAudits: adminLoginAudits(client),
    reports: adminReports(client),
  },
})
