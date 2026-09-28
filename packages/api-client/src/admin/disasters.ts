import type { ApiResource, DisasterRecord } from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminDisasters = (client: ApiClient) => ({
  list: () =>
    client.get<ApiResource<DisasterRecord[]>>("/v1/admin/disasters"),
})