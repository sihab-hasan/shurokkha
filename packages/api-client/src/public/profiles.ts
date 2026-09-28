import type {
  ApiResource,
  PublicProfileRecord,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const publicProfiles = (client: ApiClient) => ({
  get: (username: string) =>
    client.get<ApiResource<PublicProfileRecord>>(
      `/v1/public/profiles/${encodeURIComponent(username)}`
    ),
})