import type { ApiClient } from "../client"

import { coreTvup } from "./core"
import { health } from "./health"

export const makeSystem = (client: ApiClient) => ({
  system: {
    health: health(client),
  },
  core: {
    tvup: coreTvup(client),
  },
})
