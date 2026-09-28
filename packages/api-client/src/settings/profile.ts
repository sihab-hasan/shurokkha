import type {
  ApiResource,
  Profile,
  ProfileInput,
  UpdatePasswordInput,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const profile = (client: ApiClient) => ({
  get: () => client.get<ApiResource<Profile>>("/v1/auth/me/profile"),
  update: (input: ProfileInput) =>
    client.patch<ApiResource<Profile>>("/v1/auth/me/profile", input),
  updatePassword: (input: UpdatePasswordInput) =>
    client.patch<ApiResource<null>>("/v1/auth/me/profile/password", input),
  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append("avatar", file)
    return client.postForm<ApiResource<Profile>>(
      "/v1/auth/me/profile/avatar",
      form
    )
  },
  destroyAvatar: () =>
    client.delete<ApiResource<Profile>>("/v1/auth/me/profile/avatar"),
})
