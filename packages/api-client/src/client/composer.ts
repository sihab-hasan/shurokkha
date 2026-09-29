import { ApiClient, createApiClient, type ApiClientOptions } from "./transport"

import { makeAuth } from "../auth"
import { makeAdmin } from "../admin"
import { makePublic } from "../public"
import { makeResources } from "../resources"
import { makeSettings } from "../settings"
import { makeSystem } from "../system"

/**
 * Assembles every domain slice onto the shared transport client.
 * Each `make*` returns its slice under its top-level key
 * (e.g. `{ auth }`, `{ admin }`) so we can spread them into one root object.
 *
 * Accepts either a configured `ApiClient` instance (preferred — lets callers
 * reuse a long-lived client) or `ApiClientOptions`, in which case a client is
 * built internally via `createApiClient`.
 */
export function createShurokkhaApi(
  clientOrOptions: ApiClient | ApiClientOptions
) {
  const client =
    clientOrOptions instanceof ApiClient
      ? clientOrOptions
      : createApiClient(clientOrOptions)

  return {
    ...makeSystem(client),
    ...makePublic(client),
    ...makeAuth(client),
    ...makeResources(client),
    ...makeAdmin(client),
    ...makeSettings(client),
  }
}
