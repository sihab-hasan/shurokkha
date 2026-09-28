import type {
  ApiResource,
  DonationInput,
  DonationRecord,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"

export const adminDonations = (client: ApiClient) => ({
  list: () => client.get<ApiResource<DonationRecord[]>>("/v1/admin/donations"),
  create: (input: DonationInput) =>
    client.post<ApiResource<DonationRecord>>("/v1/admin/donations", input),
  remove: (id: number) =>
    client.delete<void>(`/v1/admin/donations/${id}`),
})