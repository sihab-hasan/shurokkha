# @shurokkha/api-client

Typed HTTP client shared by Shurokkha frontends.

## Browser authentication

The web application uses Laravel session-cookie authentication. The client:

- sends `credentials: "include"` on every request;
- bootstraps Laravel's `XSRF-TOKEN` before unsafe requests;
- mirrors that value in `X-XSRF-TOKEN`;
- never reads or writes an authentication token in `localStorage` / `sessionStorage`;
- never injects a browser `Authorization: Bearer ...` header.

The Laravel session cookie remains HttpOnly and is managed by the browser.

```ts
import { createShurokkhaApi } from "@shurokkha/api-client"

const api = createShurokkhaApi({
  baseUrl: "http://localhost:8000/api",
})

await api.auth.login({
  email: "citizen@example.com",
  password: "password123",
})

const me = await api.auth.me()
```

For local development, use the same hostname for the Next.js frontend and Laravel API (prefer `localhost` for both).
