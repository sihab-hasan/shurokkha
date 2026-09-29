import type {
  ApiResource,
  DonationInput,
  DonationListParams,
  DonationRecord,
  DonationStats,
  PaginatedResource,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { queryString } from "../shared/query"

export const donations = (client: ApiClient) => ({
  list: (params: DonationListParams = {}) =>
    client.get<PaginatedResource<DonationRecord>>(
      `/v1/donations${queryString(params)}`
    ),
  stats: () => client.get<ApiResource<DonationStats>>("/v1/donations/stats"),
  get: (id: number) =>
    client.get<ApiResource<DonationRecord>>(`/v1/donations/${id}`),
  /**
   * Resolve a donation by its user-visible receipt number
   * (e.g. "DON-000481"). 404 when the receipt doesn't exist or
   * belongs to a different user.
   */
  getByReceipt: (receiptNumber: string) =>
    client.get<ApiResource<DonationRecord>>(
      `/v1/donations/by-receipt/${encodeURIComponent(receiptNumber)}`
    ),
  create: (input: DonationInput) =>
    client.post<ApiResource<DonationRecord>>("/v1/donations", input),
  cancel: (id: number) =>
    client.post<ApiResource<DonationRecord>>(`/v1/donations/${id}/cancel`),
})
