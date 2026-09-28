import type { ApiClient } from "../client"

import { adminAffectedAreas } from "./affected-areas"
import { adminAssignments } from "./assignments"
import { adminDisasters } from "./disasters"
import { adminDonations } from "./donations"
import { adminRescueTeams } from "./rescue-teams"
import { adminShelters } from "./shelters"
import { adminWarehouses } from "./warehouses"

export const makeAdmin = (client: ApiClient) => ({
  admin: {
    disasters: adminDisasters(client),
    affectedAreas: adminAffectedAreas(client),
    rescueTeams: adminRescueTeams(client),
    assignments: adminAssignments(client),
    shelters: adminShelters(client),
    warehouses: adminWarehouses(client),
    donations: adminDonations(client),
  },
})
