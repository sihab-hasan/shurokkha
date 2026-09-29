import type {
  ApiResource,
  DonationInput,
  DonationRecord,
  DonationStats,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export interface AdminDonationListResource {
  data: DonationRecord[]
}

export const adminDonations = (client: ApiClient) => ({
  list: () => client.get<AdminDonationListResource>("/v1/admin/donations"),
  stats: () => client.get<ApiResource<DonationStats>>("/v1/donations/stats"),
  create: (input: DonationInput) =>
    client.post<ApiResource<DonationRecord>>("/v1/admin/donations", input),
  remove: (id: number) => client.delete<void>(`/v1/admin/donations/${id}`),
})
