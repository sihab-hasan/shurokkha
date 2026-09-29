import type { ApiClient } from "../client"

import { assistanceRequests } from "./assistance-requests"
import { donations } from "./donations"
import { missingPersons } from "./missing-persons"

export const makeResources = (client: ApiClient) => ({
  resources: {
    assistanceRequests: assistanceRequests(client),
    missingPersons: missingPersons(client),
    donations: donations(client),
  },
})
