import type {
  DocumentListResource,
  DocumentResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminDocuments = (client: ApiClient) => ({
  list: () => client.get<DocumentListResource>("/v1/admin/documents"),
  get: (id: number) =>
    client.get<DocumentResource>(`/v1/admin/documents/${id}`),
  remove: (id: number) => client.delete<void>(`/v1/admin/documents/${id}`),
})
