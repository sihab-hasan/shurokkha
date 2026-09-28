import type { ApiClient } from "../client"

import { health } from "./health"

export const makeSystem = (client: ApiClient) => ({
  system: {
    health: health(client),
  },
})
