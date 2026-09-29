/**
 * Build a URL query string from a plain object, omitting `null`, `undefined`,
 * and empty-string values. Arrays are emitted as repeated keys
 * (`?key=a&key=b`) which round-trip better than comma-joined forms.
 */
export function queryString(params: object) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue

    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry === undefined || entry === null || entry === "") continue
        search.append(key, String(entry))
      }
      continue
    }

    search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ""
}

export function appendFormValue(
  form: FormData,
  key: string,
  value: string | number | null | undefined,
  includeNull = false
) {
  if (value === undefined) return
  if (value === null || value === "") {
    if (includeNull) form.append(key, "")
    return
  }
  form.append(key, String(value))
}
