# Shurokkha API

Laravel API service for the Shurokkha platform.

## Implemented account resources

### Health

- `GET /api/v1/health`

### Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`

Authenticated routes use the bearer token returned by register/login.

### Assistance requests

- `GET /api/v1/assistance-requests`
- `POST /api/v1/assistance-requests`
- `GET /api/v1/assistance-requests/{id}`
- `PATCH /api/v1/assistance-requests/{id}`
- `DELETE /api/v1/assistance-requests/{id}`
- `POST /api/v1/assistance-requests/{id}/cancel`

Citizens can only read or mutate their own records. Deletes are soft deletes.

### Missing-person reports

- `GET /api/v1/missing-persons`
- `POST /api/v1/missing-persons`
- `GET /api/v1/missing-persons/{id}`
- `GET /api/v1/missing-persons/{id}/photo`
- `PATCH /api/v1/missing-persons/{id}`
- `DELETE /api/v1/missing-persons/{id}`
- `POST /api/v1/missing-persons/{id}/close`

These routes require a signed-in session. Backend permissions grant module access and policies limit records to their owner; the URL does not encode a role.

Uploaded photos are stored on the private local disk and are returned only through the authenticated, ownership-protected photo endpoint. Deletes are soft deletes.

## Local setup

```bash
cd services/api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Configure the MySQL credentials in `.env` before running migrations.

The Web app defaults to `http://127.0.0.1:8000/api`. To point it elsewhere, set `NEXT_PUBLIC_API_URL` for `apps/web`. The shared client owns `/v1`, so the preferred value stops at `/api`.

## Validation

```bash
php artisan test
```

The feature suite covers route registration, authentication, ownership authorization, assistance-request CRUD/cancel, and missing-person CRUD/photo/close behavior.
