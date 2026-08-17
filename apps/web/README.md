# Public Web App

`@shurokkha/web` is the primary Next.js application for Shurokkha.

## Run locally

Start Laravel first:

```bash
cd services/api
php artisan serve --host=127.0.0.1 --port=8000
```

Then from the repository root:

```bash
pnpm --filter @shurokkha/web dev
```

Open `http://localhost:3000`.

## API configuration

The frontend defaults to the Laravel service at `http://127.0.0.1:8000/api`.

For an explicit local value:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Recommended value:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

The shared API client also safely normalizes `http://127.0.0.1:8000` and `http://127.0.0.1:8000/api/v1`, preventing accidental `/api/v1/v1/...` requests.

## Connected flows

The following frontend flows are connected to Laravel:

- sign up, sign in, current-session verification, sign out;
- Citizen assistance request create/list/detail/update/cancel/delete;
- Citizen missing-person report create/list/detail/photo/update/close/delete.

Other public, donor, volunteer, alert, shelter, disaster, messaging, notification, profile, and settings screens remain product/UI scaffolds until their own backend domains are implemented. They must not invent API endpoints.

## Validation

```bash
pnpm check:api-connections
pnpm check:architecture
pnpm --filter @shurokkha/web lint
pnpm --filter @shurokkha/web typecheck
pnpm --filter @shurokkha/web build
```
