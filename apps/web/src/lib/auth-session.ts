/**
 * Browser authentication is intentionally not persisted in Web Storage.
 *
 * Laravel owns the authenticated session in an HttpOnly cookie. The browser
 * sends that cookie automatically via `credentials: "include"`; frontend
 * JavaScript never receives or stores the session credential.
 *
 * The separate `XSRF-TOKEN` cookie is intentionally readable by JavaScript so
 * the API client can echo it in the `X-XSRF-TOKEN` header for CSRF protection.
 */
export const AUTH_SESSION_STORAGE = "http-only-cookie" as const
