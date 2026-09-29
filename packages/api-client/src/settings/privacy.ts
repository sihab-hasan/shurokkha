import type {
  AccountDeletionRequest,
  ApiResource,
  DataExportRequest,
  PrivacyPreferences,
  PrivacyPreferencesInput,
  RequestAccountDeletionInput,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const privacy = (client: ApiClient) => ({
  get: () =>
    client.get<ApiResource<PrivacyPreferences>>(
      "/v1/auth/me/privacy-preferences"
    ),
  update: (input: PrivacyPreferencesInput) =>
    client.put<ApiResource<PrivacyPreferences>>(
      "/v1/auth/me/privacy-preferences",
      input
    ),
  dataExport: {
    get: () =>
      client.get<ApiResource<DataExportRequest>>("/v1/auth/me/data-export"),
    request: () =>
      client.post<ApiResource<DataExportRequest>>("/v1/auth/me/data-export"),
  },
  accountDeletion: {
    get: () =>
      client.get<ApiResource<AccountDeletionRequest>>(
        "/v1/auth/me/account-deletion"
      ),
    request: (input: RequestAccountDeletionInput) =>
      client.post<ApiResource<AccountDeletionRequest>>(
        "/v1/auth/me/account-deletion",
        input
      ),
    cancel: () =>
      client.delete<ApiResource<null>>("/v1/auth/me/account-deletion"),
  },
})
