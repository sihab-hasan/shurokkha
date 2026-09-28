import type { ApiClient } from "../client"

import { auth } from "./endpoints"

export { auth }
export type AuthApi = ReturnType<typeof auth>

export const makeAuth = (client: ApiClient) => ({ auth: auth(client) })
