import type {
  ApiResource,
  NotificationPreferences,
  NotificationPreferencesInput,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const notifications = (client: ApiClient) => ({
  get: () =>
    client.get<ApiResource<NotificationPreferences>>(
      "/v1/auth/me/notification-preferences"
    ),
  update: (input: NotificationPreferencesInput) =>
    client.put<ApiResource<NotificationPreferences>>(
      "/v1/auth/me/notification-preferences",
      input
    ),
})
