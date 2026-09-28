import type { ApiClient } from "../client"

import { publicAffectedAreas } from "./affected-areas"
import { publicDisasters } from "./disasters"
import { publicProfiles } from "./profiles"
import { publicShelters } from "./shelters"

export const makePublic = (client: ApiClient) => ({
  public: {
    disasters: publicDisasters(client),
    shelters: publicShelters(client),
    affectedAreas: publicAffectedAreas(client),
    profiles: publicProfiles(client),
  },
})