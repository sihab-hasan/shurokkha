import type {
  ApiResource,
  TwoFactorDisableResponse,
  TwoFactorEnableResponse,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const twoFactor = (client: ApiClient) => ({
  enable: () =>
    client.post<ApiResource<TwoFactorEnableResponse>>(
      "/v1/auth/me/two-factor/enable"
    ),
  disable: () =>
    client.post<ApiResource<TwoFactorDisableResponse>>(
      "/v1/auth/me/two-factor/disable"
    ),
})