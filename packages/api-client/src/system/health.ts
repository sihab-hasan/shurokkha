import type { ApiClient } from "../client"

export const health = (client: ApiClient) => ({
  check: () =>
    client.get<{ status: string; service: string; version: string }>(
      "/v1/health"
    ),
})