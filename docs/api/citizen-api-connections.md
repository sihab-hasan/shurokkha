# Citizen API connection map

The Laravel router adds `/api` to `routes/api.php`, and the route file adds `/v1`.

Browser authentication is **session-cookie based**. The Laravel session cookie is HttpOnly and is never exposed to frontend JavaScript. The separate `XSRF-TOKEN` cookie is intentionally readable so the typed client can echo it in the `X-XSRF-TOKEN` header for CSRF protection.

For local development, keep Next.js and Laravel on the **same hostname**. The recommended setup is:

```env
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

```env
# services/api/.env
APP_URL=http://localhost:8000
FRONTEND_URLS=http://localhost:3000,http://127.0.0.1:3000
SESSION_HTTP_ONLY=true
SESSION_SECURE_COOKIE=false
SESSION_SAME_SITE=lax
```

Do not browse the frontend as `localhost` while configuring the API as `127.0.0.1`; cookies are host scoped.

## Registered and connected routes

| Method | Laravel route                                | Frontend caller                     |
| ------ | -------------------------------------------- | ----------------------------------- |
| GET    | `/api/v1/health`                             | `getShurokkhaApi().system.health()` |
| GET    | `/api/v1/auth/csrf`                          | API client CSRF bootstrap           |
| POST   | `/api/v1/auth/register`                      | Sign-up form                        |
| POST   | `/api/v1/auth/login`                         | Sign-in form                        |
| GET    | `/api/v1/auth/me`                            | `AuthGate` session verification     |
| POST   | `/api/v1/auth/logout`                        | Sign-out handler                    |
| GET    | `/api/v1/citizen/requests`                   | Assistance request list             |
| POST   | `/api/v1/citizen/requests`                   | Assistance request create form      |
| GET    | `/api/v1/citizen/requests/{id}`              | Assistance request detail           |
| PATCH  | `/api/v1/citizen/requests/{id}`              | Assistance request edit form        |
| DELETE | `/api/v1/citizen/requests/{id}`              | Assistance request detail delete    |
| POST   | `/api/v1/citizen/requests/{id}/cancel`       | Assistance request detail cancel    |
| GET    | `/api/v1/citizen/missing-persons`            | Missing-person list                 |
| POST   | `/api/v1/citizen/missing-persons`            | Missing-person create form          |
| GET    | `/api/v1/citizen/missing-persons/{id}`       | Missing-person detail               |
| GET    | `/api/v1/citizen/missing-persons/{id}/photo` | Protected missing-person photo      |
| PATCH  | `/api/v1/citizen/missing-persons/{id}`       | Missing-person edit form            |
| DELETE | `/api/v1/citizen/missing-persons/{id}`       | Missing-person detail delete        |
| POST   | `/api/v1/citizen/missing-persons/{id}/close` | Missing-person located/close action |

Total connected Laravel API routes: **19**.

## Browser auth flow

```text
Sign in / register
    ↓
GET /api/v1/auth/csrf
    ↓
Laravel sets XSRF-TOKEN
    ↓
POST /api/v1/auth/login or /register
    ↓
Laravel regenerates the session
    ↓
HttpOnly shurokkha_session cookie
    ↓
Browser sends cookies automatically (credentials: include)
    ↓
GET /api/v1/auth/me verifies the signed-in session
```

No authentication credential is stored in `localStorage` or `sessionStorage`.

## Frontend routes backed by these APIs

- `/sign-up`
- `/sign-in`
- `/sign-out`
- `/citizen`
- `/citizen/request-help`
- `/citizen/requests`
- `/citizen/requests/[requestId]`
- `/citizen/missing-persons`
- `/citizen/missing-persons/create`
- `/citizen/missing-persons/[personId]`

## Automated audit

Run:

```bash
pnpm check:api-connections
```

The check verifies all 19 API mappings, credential-cookie transport, CSRF wiring, and rejects browser bearer-token/localStorage auth references.
