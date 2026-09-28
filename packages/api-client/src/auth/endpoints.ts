import type { ApiClient } from "../client"

import type { ApiResource, ApiUser, AuthResponse } from "@shurokkha/contracts"

export const auth = (client: ApiClient) => ({
  csrf: () => client.get<{ csrf: string }>("/v1/auth/csrf"),
  register: async (input: {
    name: string
    email: string
    password: string
  }) => {
    await client.get<{ csrf: string }>("/v1/auth/csrf")
    return client.post<AuthResponse>("/v1/auth/register", input)
  },
  login: async (input: {
    email: string
    password: string
    remember?: boolean
  }) => {
    await client.get<{ csrf: string }>("/v1/auth/csrf")
    return client.post<AuthResponse>("/v1/auth/login", input)
  },
  me: () => client.get<ApiResource<ApiUser>>("/v1/auth/me"),
  logout: () => client.post<void>("/v1/auth/logout"),
})
