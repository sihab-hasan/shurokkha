import type {
  ApiResource,
  BulkActionResult,
  MissingPersonListParams,
  MissingPersonReportInput,
  MissingPersonReportRecord,
  PaginatedResourceWithFacets,
} from "@shurokkha/contracts"

import type { ApiClient } from "../client"
import { appendFormValue, queryString } from "../shared/query"

function missingPersonFormData(
  input: MissingPersonReportInput,
  options: {
    photo?: File | null
    includeNulls?: boolean
    removePhoto?: boolean
  } = {}
) {
  const form = new FormData()
  const includeNulls = options.includeNulls ?? false

  appendFormValue(form, "full_name", input.full_name)
  appendFormValue(form, "age", input.age, includeNulls)
  appendFormValue(form, "gender", input.gender, includeNulls)
  appendFormValue(
    form,
    "physical_description",
    input.physical_description,
    includeNulls
  )
  appendFormValue(
    form,
    "distinguishing_features",
    input.distinguishing_features,
    includeNulls
  )
  appendFormValue(form, "last_seen_at", input.last_seen_at)
  appendFormValue(form, "last_seen_location", input.last_seen_location)
  appendFormValue(form, "latitude", input.latitude, includeNulls)
  appendFormValue(form, "longitude", input.longitude, includeNulls)
  appendFormValue(form, "contact_phone", input.contact_phone)

  if (options.photo) form.append("photo", options.photo)
  if (options.removePhoto) form.append("remove_photo", "1")

  return form
}

export const missingPersons = (client: ApiClient) => ({
  list: (params: MissingPersonListParams = {}) =>
    client.get<PaginatedResourceWithFacets<MissingPersonReportRecord>>(
      `/v1/missing-persons${queryString(params)}`
    ),
  get: (id: string) =>
    client.get<ApiResource<MissingPersonReportRecord>>(
      `/v1/missing-persons/${id}`
    ),
  create: (input: MissingPersonReportInput, photo?: File | null) =>
    client.postForm<ApiResource<MissingPersonReportRecord>>(
      "/v1/missing-persons",
      missingPersonFormData(input, { photo })
    ),
  update: (
    id: string,
    input: MissingPersonReportInput,
    options: { photo?: File | null; removePhoto?: boolean } = {}
  ) =>
    client.patchForm<ApiResource<MissingPersonReportRecord>>(
      `/v1/missing-persons/${id}`,
      missingPersonFormData(input, {
        ...options,
        includeNulls: true,
      })
    ),
  photo: (id: string) => client.getBlob(`/v1/missing-persons/${id}/photo`),
  close: (id: string, located: boolean) =>
    client.post<ApiResource<MissingPersonReportRecord>>(
      `/v1/missing-persons/${id}/close`,
      { located }
    ),
  bulkClose: (ids: string[]) =>
    client.post<ApiResource<BulkActionResult>>(
      "/v1/missing-persons/bulk-close",
      { ids }
    ),
  remove: (id: string) => client.delete<void>(`/v1/missing-persons/${id}`),
})
